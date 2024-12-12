import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJwt } from "react-jwt";
import { useCookies } from 'react-cookie';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
import ChartControls from '../../comp/ChartControls';
import '../../css/stats/stat.css'

const Stat = () => {
    const [cookie] =  useCookies();
    const { isExpired } = useJwt(cookie.token);
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
                zoom: {enabled: false},
            },
            colors: ['#77B6EA', '#ed477c'],
            dataLabels: {enabled: true},
            stroke: {curve: 'smooth'},
            title: {
                text: '월별 독서량',
                align: 'center',
                style: {fontSize: '24px', fontWeight: 'bold', color: '#333'},
            },
            grid: {
                borderColor: '#e7e7e7',
                row: {colors: ['#f3f3f3', 'transparent'], opacity: 0.5},
            },
            markers: {size: 1},
            xaxis: {categories: [], title: {text: '월'}},
            yaxis: {title: {text: '독서량(권 수)'}},
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
            chart: {type: 'bar', height: 390},
            plotOptions: {
                bar: {
                    barHeight: '100%',
                    distributed: true,
                    horizontal: true,
                    dataLabels: {position: 'bottom'},
                },
            },
            dataLabels: {
                enabled: true,
                textAnchor: 'start',
                style: {colors: ['#fff']},
                formatter: function (val, opt) {
                    return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val
                },
                offsetX: 0,
                dropShadow: {enabled: true},
            },
            stroke: {width: 1, colors: ['#fff']},
            colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B',
                '#2b908f', '#f9a3a4', '#90ee7e', '#f48024', '#69d2e7'
            ],
            xaxis: {categories: []},
            yaxis: {show: false},
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
                toolbar: {show: true, tools: {download: true}},
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
                        name: {show: true},
                        value: {
                            show: true,
                            formatter: function(value, total) {
                                return Math.round(value / total.globals.seriesTotals.reduce((a, b) => a + b, 0) * 100) + "%" ;
                            },
                        },
                        total: {
                            show: true,
                            label: '전 지역',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#333',
                            formatter: function (w) {return w.globals.seriesTotals.reduce((a, b) => a + b, 0);},
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
                {breakpoint: 480, options: {legend: {show: false}}},
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

    const fetchChartData = async ({ url, params, stateUpdater }) => {
        setLoading(true);
        try {
            const response = await axios.get(url, { params });
            stateUpdater(response.data);
        } catch (err) {
            console.error('Error fetching chart data:', err);
            setError('차트 데이터를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!cookie.token || isExpired) {
            alert('로그인 후 확인할 수 있습니다.');
            navigate('/signin');
            return;
        }

        if (selectedChart === 'chart1') {
            // 차트1 초기화
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
                        zoom: {enabled: false},
                    },
                    colors: ['#77B6EA', '#ed477c'],
                    dataLabels: {enabled: true},
                    stroke: {curve: 'smooth'},
                    title: {
                        text: '월별 독서량',
                        align: 'center',
                        style: {fontSize: '24px', fontWeight: 'bold', color: '#333'},
                    },
                    grid: {
                        borderColor: '#e7e7e7',
                        row: {colors: ['#f3f3f3', 'transparent'], opacity: 0.5},
                    },
                    markers: {size: 1},
                    xaxis: {categories: [], title: {text: '월'}},
                    yaxis: {title: {text: '독서량(권 수)'}},
                    legend: {
                        position: 'top',
                        horizontalAlign: 'right',
                        floating: true,
                        offsetY: -25,
                        offsetX: -5
                    }
                },
            });

            fetchChartData({
                url: `${process.env.REACT_APP_SERVER}/stat/book_read`,
                params: { ageGroup, year },
                stateUpdater: (data) => {
                    const { series, categories } = data;
                    
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
                }
            });
        }

        if (selectedChart === 'chart2') {
            fetchChartData({
                url: `${process.env.REACT_APP_SERVER}/stat/book_rank`,
                params: { ageGroup, year, month: selectedMonth, gender },
                stateUpdater: (data) => {
                    const { series, categories } = data;

                    setChart2State((prevState) => ({
                        ...prevState,
                        series: [{name: '찜 횟수', data: series[0].data}],
                        categories,
                        options: {
                            ...prevState.options,
                            xaxis: {
                                ...prevState.options.xaxis,
                                categories,
                            },
                        },
                    }));
                },
            });
        }

        if (selectedChart === 'chart3') {
            fetchChartData({
                url: `${process.env.REACT_APP_SERVER}/stat/library_rank`,
                params: { ageGroup, year, month: selectedMonth, gender, region },
                stateUpdater: (data) => {
                    const { series, labels, total, regions } = data;

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
                },
            });
        }

    }, [selectedChart, chartType, ageGroup, year, selectedMonth, gender, region, cookie.token, isExpired]);

    // 연령대 선택
    const handleChartSwitch = (chartType) => {
        setSelectedChart(chartType);
        setSelectedMonth('');
        setAgeGroup('');
        setGender('');
        setYear(new Date().getFullYear());
    };

    if (error) {
        return <div className="stat-wrap">{error}</div>;
      }

    return (
        <div className="stat-wrap">
            <h1>통계</h1>
            
            <div className="button-group">
                <button onClick={() => handleChartSwitch('chart1')}>독서량</button>
                <button onClick={() => handleChartSwitch('chart2')}>도서 찜 순위</button>
                <button onClick={() => handleChartSwitch('chart3')}>도서관 찜 순위</button>
            </div>
            <ChartControls
                selectedChart={selectedChart}
                year={year}
                setYear={setYear}
                selectedMonth={selectedMonth}
                setSelectedMonth={setSelectedMonth}
                gender={gender}
                setGender={setGender}
                region={region}
                setRegion={setRegion}
                regionOptions={regionOptions}
                ageGroup={ageGroup}
                setAgeGroup={setAgeGroup}
                chartType={chartType}
                setChartType={setChartType}
            />
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