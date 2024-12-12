import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJwt } from "react-jwt";
import { jwtDecode } from "jwt-decode";
import { useCookies } from 'react-cookie';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import '../../css/stats/stat.css'

const Stat = () => {
    const [cookie] =  useCookies();
    const { isExpired, decodedToken } = useJwt(cookie.token);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChart, setSelectedChart] = useState('chart1');
    const [chartType, setChartType] = useState('line');
    const [ageGroup, setAgeGroup] = useState('');
    const [gender, setGender] = useState('');
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState('');
    const [region, setRegion] = useState('');
    const [regionOptions, setRegionOptions] = useState([]);

    const [chart1State, setChart1State] = useState({
        series: [],
        options: {
            chart: {
                height: 600,
                type: 'line',
                dropShadow: {
                enabled: true,
                color: '#000',
                top: 18,
                left: 7,
                blur: 10,
                opacity: 0.5
                },
                zoom: {
                enabled: false
                },
            },
            colors: ['#77B6EA', '#ed477c'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth'
            },
            title: {
                text: '월별 독서량',
                align: 'center',
                style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                },
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: [],
                title: {
                text: '월'
                }
            },
            yaxis: {
                title: {
                text: '독서량(권 수)'
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        },
    });

    const [chart2State, setChart2State] = useState({
        series: [],
        options: {
            chart: {
                type: 'bar',
                height: 390,
            },
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {
                        position: 'bottom',
                    },
                },
            },
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {
                    colors: ['#fff'],
                },
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {
                    enabled: true
                },
            },
            stroke: {
                width: 1,
                colors: ['#fff']
            },
            colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B',
                '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7'
            ],
            xaxis: {
                categories: [],
            },
            title: {
                text: '도서 찜 순위 TOP 10',
                align: 'center',
                style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                },
            },
        },
    });

    const [chart3State, setChart3State] = useState({
        series: [],
        options: {
            chart: {
                height: 600,
                type: 'radialBar',
                toolbar: {
                    show: true,
                    tools: {
                        download: true,
                    },
                },
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '30%',
                        background: 'transparent',
                        image: undefined,
                    },
                    dataLabels: {
                        name: {
                            show: true,
                        },
                        value: {
                            show: true,
                        },
                        total: {
                            show: true,
                            label: '전 지역',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#333',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => a + b, 0); 
                            },
                        },
                    },
                    barLabels: {
                        enabled: true,
                        useSeriesColors: true,
                        offsetX: -8,
                        fontSize: '16px',
                        formatter: function (seriesName, opts) {
                            return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
                        },
                    },
                },
            },
            colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5', '#77B6EA'],
            labels: [],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            show: false,
                        },
                    },
                },
            ],
            title: {
                text: '도서관 찜 순위 TOP 5',
                align: 'center',
                style: {
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#333',
                },
            },
        },
    });

    useEffect(() => {
        if (!cookie.token || isExpired) {
            alert('로그인 후 확인할 수 있습니다.');
            navigate('/signin');
            return;
          }

        if (selectedChart === 'chart1') {
            const fetchChart1Data = async () => {
                setChart1State({
                    series: [],
                    options: {
                        chart: {
                            height: 600,
                            type: 'line',
                            dropShadow: {
                            enabled: true,
                            color: '#000',
                            top: 18,
                            left: 7,
                            blur: 10,
                            opacity: 0.5
                            },
                            zoom: {
                            enabled: false
                            },
                        },
                        colors: ['#77B6EA', '#ed477c'],
                        dataLabels: {
                            enabled: true,
                        },
                        stroke: {
                            curve: 'smooth'
                        },
                        title: {
                            text: '월별 독서량',
                            align: 'center',
                            style: {
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#333',
                            },
                        },
                        grid: {
                            borderColor: '#e7e7e7',
                            row: {
                            colors: ['#f3f3f3', 'transparent'],
                            opacity: 0.5
                            },
                        },
                        markers: {
                            size: 1
                        },
                        xaxis: {
                            categories: [],
                            title: {
                            text: '월'
                            }
                        },
                        yaxis: {
                            title: {
                            text: '독서량(권 수)'
                            },
                        },
                        legend: {
                            position: 'top',
                            horizontalAlign: 'right',
                            floating: true,
                            offsetY: -25,
                            offsetX: -5
                        }
                    },
                });
                try {
                    setLoading(true);
                    const response = await axios.get(`${process.env.REACT_APP_SERVER}/stat/book_read`, {
                        params: { ageGroup, year },
                    });
                    const { series, categories } = response.data;
                    console.log('chart 1 :: ', response.data);
                    
                    setChart1State((prevState) => ({
                        ...prevState,
                        series,
                        options: {
                            ...prevState.options,
                            xaxis: {
                                ...prevState.options.xaxis,
                                categories,
                            },
                            chart: {
                                ...prevState.options.chart,
                                type: chartType,
                            },
                        
                        },
                    }));
                } catch (err) {
                    console.error('Error fetching chart data:', err);
                    setError('차트 데이터를 불러오는 데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };

            fetchChart1Data();
        }
    }, [selectedChart, chartType, ageGroup, year]);

    useEffect(() => {
        if (selectedChart === 'chart2') {
            const fetchChart2Data = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${process.env.REACT_APP_SERVER}/stat/book_rank`, {
                        params: { ageGroup, year, month: selectedMonth, gender },
                    });

                    const { series, categories } = response.data;

                    console.log('chart 2 :: ', response.data);

                    setChart2State((prevState) => ({
                        ...prevState,
                        series: [
                            {
                                name: '찜 횟수',
                                data: series[0].data,
                            },
                        ],
                        categories,
                        options: {
                            ...prevState.options,
                            xaxis: {
                                ...prevState.options.xaxis,
                                categories,
                            },
                        },
                    }));
                } catch (err) {
                    console.error('Error fetching chart2 data:', err);
                    setError('차트2 데이터를 불러오는 데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };

            fetchChart2Data();
        }
    }, [selectedChart, ageGroup, year, selectedMonth, gender]);

    useEffect(() => {
        if (selectedChart === 'chart3') {
            const fetchChart3Data = async () => {
                try {
                    setLoading(true);
                  
                    const response = await axios.get(`${process.env.REACT_APP_SERVER}/stat/library_rank`, {
                        params: { ageGroup, year, month: selectedMonth, gender, region },
                    });

                    const { series, labels, total, regions } = response.data;

                    // 기존 옵션과 새 옵션 병합 및 중복 제거
                    setRegionOptions((prevRegions) => {
                        const uniqueRegions = new Set([...prevRegions, ...regions]);
                        return Array.from(uniqueRegions);
                    });
                    setChart3State((prevState) => ({
                        ...prevState,
                        series,
                        options: {
                            ...prevState.options,
                            labels,
                            plotOptions: {
                                ...prevState.options.plotOptions,
                                radialBar: {
                                    ...prevState.options.plotOptions.radialBar,
                                    dataLabels: {
                                        ...prevState.options.plotOptions.radialBar.dataLabels,
                                        total: {
                                            ...prevState.options.plotOptions.radialBar.dataLabels.total,
                                            formatter: () => total,
                                            label: region === '' ? '전 지역' : region,
                                        },
                                    },
                                },
                            },
                        },
                    }));
                } catch (err) {
                    console.error('Error fetching chart3 data:', err);
                    setError('차트3 데이터를 불러오는 데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };
    
            fetchChart3Data();
        }
    }, [selectedChart, ageGroup, year, selectedMonth, gender, region]);

    // 연령대 선택
    const handleChartSwitch = (chartType) => {
        setSelectedChart(chartType);
        setSelectedMonth('');
        setAgeGroup('');
        setGender('');
        setYear(new Date().getFullYear());
    };

    return (
        <div className="stat-wrap">
            <h1>통계</h1>
            
            <div className="button-group">
                <button onClick={() => handleChartSwitch('chart1')}>독서량</button>
                <button onClick={() => handleChartSwitch('chart2')}>도서 찜 순위</button>
                <button onClick={() => handleChartSwitch('chart3')}>도서관 찜 순위</button>
            </div>
            <div className="controls">
                <label htmlFor="year">년도 선택: </label>
                <select
                    id="year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {Array.from({ length: 2 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - i}>
                            {new Date().getFullYear() - i}
                        </option>
                    ))}
                </select>

                {selectedChart !== 'chart1' && (
                    <>
                        <label htmlFor="month">월 선택: </label>
                        <select
                            id="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="01">1월</option>
                            <option value="02">2월</option>
                            <option value="03">3월</option>
                            <option value="04">4월</option>
                            <option value="05">5월</option>
                            <option value="06">6월</option>
                            <option value="07">7월</option>
                            <option value="08">8월</option>
                            <option value="09">9월</option>
                            <option value="10">10월</option>
                            <option value="11">11월</option>
                            <option value="12">12월</option>
                        </select>

                        <label htmlFor="gender">성별 선택: </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="M">남자</option>
                            <option value="F">여자</option>
                        </select>
                    </>
                )}

                {selectedChart === 'chart3' && (
                    <>
                        <label htmlFor="region">지역 선택: </label>
                        <select
                            id="region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <option value="">전체</option>
                            {regionOptions.map((regionOption, index) => (
                                <option key={index} value={regionOption}>
                                    {regionOption}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <label htmlFor="ageGroup">연령대 선택: </label>
                <select
                    id="ageGroup"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                >
                    <option value="">전체</option>
                    <option value="10">10대</option>
                    <option value="20">20대</option>
                    <option value="30">30대</option>
                    <option value="40">40대</option>
                    <option value="50">50대</option>
                    <option value="60">60대 이상</option>
                </select>

                {selectedChart === 'chart1' && (
                    <>
                        <label htmlFor="chartType">차트 유형: </label>
                        <select
                            id="chartType"
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                        >
                            <option value="line">선형 차트</option>
                            <option value="bar">막대 차트</option>
                            <option value="area">영역 차트</option>
                        </select>
                    </>
                )}
            </div>
            <div className='charts'>
                {selectedChart === 'chart1' && chart1State.series.some(s => s.data.some(d => d > 0)) ? (
                    <ReactApexChart
                        options={chart1State.options}
                        series={chart1State.series}
                        type={chartType}
                    />
                ) : selectedChart === 'chart1' ? (
                    <div className="no-data">
                        <p>선택된 옵션에 대한 데이터가 없습니다.</p>
                    </div>
                ) : null}
                {selectedChart === 'chart2' && chart2State.categories?.length > 0 ? (
                    <ReactApexChart
                        options={chart2State.options}
                        series={chart2State.series}
                        type='bar'
                    />
                ) : selectedChart === 'chart2' ? (
                    <div className="no-data">
                        <p>선택된 옵션에 대한 데이터가 없습니다.</p>
                    </div>
                ) : null}
                {selectedChart === 'chart3' && chart3State.series.length > 0 ? (
                    <ReactApexChart
                        options={chart3State.options}
                        series={chart3State.series}
                        type='radialBar'
                        height={600}
                    />
                ) : selectedChart === 'chart3' ? (
                    <div className="no-data">
                        <p>선택된 옵션에 대한 데이터가 없습니다.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default Stat;