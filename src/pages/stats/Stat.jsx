import React, { useState, useEffect } from 'react';
import '../../css/Home.css';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const Stat = () => {
    const [state, setState] = useState({
        series: [],
        options: {
            chart: {
                height: 350,
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
                toolbar: {
                show: false
                }
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
                min: 0,
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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedChart, setSelectedChart] = useState('chart1');
    const [ageGroup, setAgeGroup] = useState('all');
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_SERVER}/stat/book_read`,
                    { params: { ageGroup, year } }
                );
                const { series, categories } = response.data;
    
                setState((prevState) => ({
                    ...prevState,
                    series,
                    options: {
                        ...prevState.options,
                        xaxis: {
                            ...prevState.options.xaxis,
                            categories,
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
    
        fetchChartData();
    }, [ageGroup, year]);

    const handleChartSwitch = (chartType) => {
        setSelectedChart(chartType);
        setAgeGroup('all'); // 연령대를 초기화
        setYear(new Date().getFullYear());
    };

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    const alternativeState = {
        series: [
            { name: 'Example', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }
        ],
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            title: {
                text: 'Example 차트',
                align: 'center'
            },
            xaxis: {
                categories: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
                title: { text: '카테고리' }
            },
            yaxis: {
                title: { text: '값' }
            }
        }
    };


    return (
        <div className="stat-wrap">
            <h1>통계</h1>
            
            <div className="button-group">
                <button onClick={() => handleChartSwitch('chart1')}>독서량 차트</button>
                <button onClick={() => handleChartSwitch('chart2')}>대체 차트</button>
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
            </div>
            {selectedChart === 'chart1' && (
                <ReactApexChart
                    options={state.options}
                    series={state.series}
                    type="line"
                    height={400}
                    width={550}
                />
            )}
            {selectedChart === 'chart2' && (
                <ReactApexChart
                    options={alternativeState.options}
                    series={alternativeState.series}
                    type="bar"
                    height={400}
                    width={550}
                />
            )}
        </div>
    );
};

export default Stat;
