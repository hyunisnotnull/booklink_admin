import React from 'react';

const ChartControls = ({
    selectedChart,
    year,
    setYear,
    selectedMonth,
    setSelectedMonth,
    gender,
    setGender,
    region,
    setRegion,
    regionOptions,
    ageGroup,
    setAgeGroup,
    chartType,
    setChartType,
}) => (
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
            {[...Array(12)].map((_, i) => (
                <option key={i} value={`${i + 1}`.padStart(2, '0')}>{`${i + 1}월`}</option>
            ))}
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
);

export default ChartControls;