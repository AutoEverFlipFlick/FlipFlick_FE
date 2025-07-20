import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Users, NotebookPen, MessagesSquare, User, Clapperboard } from 'lucide-react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import AdminLayout from './AdminLayout'
import { fetchDashboardStats, fetchPopcornStats, fetchTopReviewedMovies } from '@/services/admin'

interface TimeSeriesData {
  date: string
  newCount: number
  totalCount: number
}

interface PopcornGradeData {
  grade: string
  count: number
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  color: white;
  padding: 0.2rem 2rem 2rem 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`

const Header = styled.div`
  margin-bottom: 3rem;
  animation: ${slideIn} 0.8s ease-out;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`

const StatCard = styled.div<{ $delay: number }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out ${props => props.$delay}s both;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px ${props => props.$color}40;
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #a0a0a0;
`

const ChartContainer = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.8s ease-out 0.6s both;
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const ChartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`

const TimeFilter = styled.div`
  display: flex;
  gap: 0.5rem;
`

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${props =>
    props.$active ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: 8px;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props =>
      props.$active ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'rgba(255, 255, 255, 0.2)'};
  }
`

const BottomChartSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`

const ChartBox = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ChartBoxHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
`

const Dashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'7D' | '30D' | '90D'>('7D')
  const [activeStat, setActiveStat] = useState<'user' | 'review' | 'discussion'>('user')
  const [statsData, setStatsData] = useState<{
    user: Record<'7D' | '30D' | '90D', TimeSeriesData[]>
    review: Record<'7D' | '30D' | '90D', TimeSeriesData[]>
    discussion: Record<'7D' | '30D' | '90D', TimeSeriesData[]>
  } | null>(null)
  const [popcornStats, setPopcornStats] = useState<PopcornGradeData[]>([])
  const [topMovies, setTopMovies] = useState<{ title: string; reviewCount: number }[]>([])

  useEffect(() => {
    fetchDashboardStats()
      .then(data => {
        setStatsData(data.data.stats)
      })
      .catch(error => {
        console.error('대시보드 데이터 로드 실패:', error)
      })
  }, [])

  useEffect(() => {
    fetchPopcornStats()
      .then(data => {
        setPopcornStats(data.data)
      })
      .catch(error => {
        console.error('대시보드 데이터 로드 실패:', error)
      })
  }, [])

  useEffect(() => {
    fetchTopReviewedMovies()
      .then(res => {
        setTopMovies(res.data) // 응답 구조에 맞게 조정
      })
      .catch(err => console.error('Top 영화 조회 실패:', err))
  }, [])

  const data: TimeSeriesData[] = statsData?.[activeStat]?.[activeFilter] ?? []

  const totalSeries = data.map(d => d.totalCount)
  const newSeries = data.map(d => d.newCount)

  const statNames = {
    user: ['총 회원 수', '신규 회원 수'],
    review: ['총 리뷰 수', '신규 리뷰 수'],
    discussion: ['총 토론 수', '신규 토론 수'],
  }
  const statName = {
    user: ['회원 수'],
    review: ['리뷰 수'],
    discussion: ['토론 수'],
  }

  const colorMap: Record<string, string> = {
    팝콘기계: '#ffd43b',
    '1 팝콘': '#ffa94d',
    '2/3 팝콘': '#f093fb',
    '1/3 팝콘': '#5c7cfa',
    '빈 팝콘': '#4ecdc4',
    '옥수수 3': '#ff6b6b',
    '옥수수 2': '#5cec68',
    '옥수수 1': '#91a7ff',
  }

  const series = [
    { name: statNames[activeStat][0], data: totalSeries },
    { name: statNames[activeStat][1], data: newSeries },
  ]
  const latestUserTotal = statsData?.user?.[activeFilter]?.at(-1)?.totalCount ?? 0
  const latestReviewTotal = statsData?.review?.[activeFilter]?.at(-1)?.totalCount ?? 0

  const options: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      foreColor: '#a0a0a0',
      zoom: { enabled: false },
    },
    grid: {
      borderColor: '#a0a0a0', // ✅ 수치 구간 선 색상
    },
    colors: ['#4ecdc4', '#ff6b6b'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: data.map(d => d.date), type: 'datetime', labels: { format: 'MM/dd' } },
    yaxis: [
      {
        title: { text: series[0].name, style: { color: '#a0a0a0' } },
        labels: { style: { colors: '#a0a0a0' } },
      },
      {
        opposite: true,
        title: { text: series[1].name, style: { color: '#a0a0a0' } },
        labels: { style: { colors: '#a0a0a0' } },
      },
    ],
    tooltip: {
      shared: true,
      x: { format: 'yyyy-MM-dd' },
    },
    legend: { labels: { colors: '#fff' } },
  }
  const donutLabels = popcornStats.map(d => d.grade)
  const donutSeries = popcornStats.map(d => d.count)
  const donutColors = donutLabels.map(grade => colorMap[grade] || '#cccccc')
  const donutOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: donutLabels,

    colors: donutColors,
    legend: {
      labels: {
        colors: '#a0a0a0',
      },
    },
    stroke: {
      show: true,
      colors: ['transparent'],
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  }
  const barSeries = [
    {
      data: topMovies.map(movie => movie.reviewCount),
    },
  ]
  const barOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 380,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: 'end',
        barHeight: '80%',
        distributed: false, // ⚠️ 그라데이션 사용 시 false로 설정
        horizontal: true,
        dataLabels: {
          position: 'bottom',
        },
      },
    },

    colors: ['#f093fb'],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light', // 또는 'dark', 'none'
        type: 'diagonal1', // 수평/수직 외 'diagonal1', 'diagonal2' 가능
        shadeIntensity: 0.5,
        gradientToColors: ['#f5576c'], // 끝 색상
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 1,
        stops: [0, 100], // 그라데이션 시작-끝
      },
    },
    tooltip: {
      marker: { show: false }, // 색 네모 제거
      theme: 'light',
      x: { show: false },
      y: {
        title: {
          formatter: (seriesName, { dataPointIndex, w }) => {
            return w.globals.labels[dataPointIndex] // 영화 이름 반환
          },
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
        return opt.w.globals.labels[opt.dataPointIndex] + ': ' + val
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['transparent'], // 오타 수정: 'transfort' → 'transparent'
    },
    grid: {
      borderColor: 'transparent',
    },
    legend: {
      labels: {
        colors: '#a0a0a0',
      },
      onItemClick: { toggleDataSeries: false },
      onItemHover: { highlightDataSeries: false },
    },
    xaxis: {
      categories: topMovies.map(movie => movie.title),
      labels: {
        style: {
          colors: '#a0a0a0',
        },
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
  }
  return (
    <AdminLayout>
      <Container>
        <Header>
          <Title>Dashboard</Title>
        </Header>

        <StatsGrid>
          <StatCard
            $delay={0.2}
            onClick={() => setActiveStat('user')}
            style={{
              border: activeStat === 'user' ? '2px solid #4ecdc4' : undefined,
              transform: activeStat === 'user' ? 'scale(1.03)' : undefined,
            }}
          >
            <StatIcon $color="linear-gradient(45deg, #4ecdc4, #6ee7db)">
              <Users size={24} />
            </StatIcon>
            <StatValue>{latestUserTotal}</StatValue>
            <StatLabel>총 회원 수</StatLabel>
          </StatCard>

          <StatCard
            $delay={0.1}
            onClick={() => setActiveStat('review')}
            style={{
              border: activeStat === 'review' ? '2px solid #ff6b6b' : undefined,
              transform: activeStat === 'review' ? 'scale(1.03)' : undefined,
            }}
          >
            <StatIcon $color="linear-gradient(45deg, #ff6b6b, #ff8e8e)">
              <NotebookPen size={24} />
            </StatIcon>
            <StatValue>{latestReviewTotal}</StatValue>
            <StatLabel>총 리뷰 수</StatLabel>
          </StatCard>

          <StatCard
            $delay={0.3}
            onClick={() => setActiveStat('discussion')}
            style={{
              border: activeStat === 'discussion' ? '2px solid #f093fb' : undefined,
              transform: activeStat === 'discussion' ? 'scale(1.03)' : undefined,
            }}
          >
            <StatIcon $color="linear-gradient(45deg, #f093fb, #f5576c)">
              <MessagesSquare size={24} />
            </StatIcon>
            <StatValue>950</StatValue>
            <StatLabel>총 토론 수</StatLabel>
          </StatCard>
        </StatsGrid>

        <ChartContainer>
          <ChartHeader>
            <ChartTitle>{statName[activeStat][0]} 그래프</ChartTitle>
            <TimeFilter>
              {(['7D', '30D', '90D'] as const).map(period => (
                <FilterButton
                  key={period}
                  $active={activeFilter === period}
                  onClick={() => setActiveFilter(period)}
                >
                  {period}
                </FilterButton>
              ))}
            </TimeFilter>
          </ChartHeader>
          <div style={{ color: '#000' }}>
            <ReactApexChart options={options} series={series} type="area" height={350} />
          </div>
        </ChartContainer>

        <BottomChartSection>
          <ChartBox>
            <ChartBoxHeader>
              <User size={20} />
              회원 등급 분포
            </ChartBoxHeader>
            <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={300} />
          </ChartBox>

          <ChartBox>
            <ChartBoxHeader>
              <Clapperboard size={20} /> 리뷰 많은 영화 Top 5
            </ChartBoxHeader>

            {topMovies.length === 0 ? (
              <p style={{ color: '#ccc', textAlign: 'center' }}>데이터가 없습니다.</p>
            ) : (
              <div style={{ color: '#000' }}>
                <ReactApexChart options={barOptions} series={barSeries} type="bar" height={300} />
              </div>
            )}
          </ChartBox>
        </BottomChartSection>
      </Container>
    </AdminLayout>
  )
}

export default Dashboard
