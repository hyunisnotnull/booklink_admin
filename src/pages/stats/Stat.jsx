import React, { useState, useEffect } from 'react';
import '../../css/Home.css';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const Stat = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChart, setSelectedChart] = useState('chart1');
    const [chartType, setChartType] = useState('line');
    const [ageGroup, setAgeGroup] = useState('all');
    const [gender, setGender] = useState('all');
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState('all');
    const [monthOptions, setMonthOptions] = useState([]);
    const [region, setRegion] = useState('all');
    const [regionOptions, setRegionOptions] = useState([]);
    const [chart1State, setChart1State] = useState({
        series: [],
        options: {
            chart: {
                height: 350,
                type: chartType,
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
                align: 'center'
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
                categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
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
                height: 350,
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
                text: '도서 찜 순위',
                align: 'center',
            },
        },
    });

    const [chart3State, setChart3State] = useState({
        series: [],
        options: {
            chart: {
                height: 390,
                type: 'radialBar',
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
                            label: region === 'all' ? '전 지역' : region,
                            formatter: function (w) {
                                // 총합 계산 (필요 시 동적으로 변경 가능)
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
            colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5'], // 원하는 색상 설정
            labels: [], // 데이터 통신으로 동적으로 추가될 부분
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
                text: '도서관 찜 순위', // 제목 설정
                align: 'center',
            },
        },
    });

    useEffect(() => {
        if (selectedChart === 'chart1') {
            const fetchChart1Data = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(`${process.env.REACT_APP_SERVER}/stat/book_read`, {
                        params: { ageGroup, year },
                    });
                    const { series, categories } = response.data;

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

                    const { series, categories, monthOptions: months } = response.data;
                    setMonthOptions(months);
                    setChart2State((prevState) => ({
                        ...prevState,
                        series: [
                            {
                                name: '찜 횟수',
                                data: series[0].data,
                            },
                        ],
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
    
                    const { series, labels, total, regions, monthOptions: months } = response.data;
                    setMonthOptions(months);
                    setRegionOptions(regions);
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
                                            formatter: () => total, // 총합 설정
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
        setSelectedMonth('all');
        setAgeGroup('all');
        setGender('all');
        setYear(new Date().getFullYear());
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

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
                    {Array.from({ length: 3 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - i}>
                            {new Date().getFullYear() - i}
                        </option>
                    ))}
                </select>

                {selectedChart !== 'chart1' && (
                    <>
                        <label htmlFor="month" style={{ marginLeft: '15px' }}>월 선택: </label>
                        <select
                            id="month"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            <option value="all">전체</option>
                            {monthOptions.map((month, index) => (
                                <option key={index} value={month}>
                                    {month}월
                                </option>
                            ))}
                        </select>

                        <label htmlFor="gender" style={{ marginLeft: '15px' }}>성별 선택: </label>
                        <select
                            id="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="all">전체</option>
                            <option value="M">남자</option>
                            <option value="W">여자</option>
                        </select>
                    </>
                )}

                {selectedChart === 'chart3' && (
                    <>
                        <label htmlFor="region" style={{ marginLeft: '15px' }}>지역 선택: </label>
                        <select
                            id="region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <option value="all">전체</option>
                            {regionOptions.map((regionOption, index) => (
                                <option key={index} value={regionOption}>
                                    {regionOption}
                                </option>
                            ))}
                        </select>
                    </>
                )}

                <label htmlFor="ageGroup" style={{ marginLeft: '15px' }}>연령대 선택: </label>
                <select
                    id="ageGroup"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                >
                    <option value="all">전체</option>
                    <option value="10">10대</option>
                    <option value="20">20대</option>
                    <option value="30">30대</option>
                    <option value="40">40대</option>
                    <option value="50">50대</option>
                    <option value="60">60대 이상</option>
                </select>

                {selectedChart === 'chart1' && (
                    <>
                        <label htmlFor="chartType" style={{ marginLeft: '15px' }}>차트 유형: </label>
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
            {selectedChart === 'chart1' && (
                <ReactApexChart
                    options={chart1State.options}
                    series={chart1State.series}
                    type={chartType}
                    height={400}
                    width={550}
                />
            )}
            {selectedChart === 'chart2' && (
                <ReactApexChart
                    options={chart2State.options}
                    series={chart2State.series}
                    type='bar'
                    height={400}
                    width={550}
                />
            )}
            {selectedChart === 'chart3' && (
                <ReactApexChart
                    options={chart3State.options}
                    series={chart3State.series}
                    type='radialBar'
                    height={400}
                    width={550}
                />
            )}
        </div>
    );
};

export default Stat;
