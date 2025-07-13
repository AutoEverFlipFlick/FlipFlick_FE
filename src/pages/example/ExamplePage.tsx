import BaseButton from '@/components/common/BaseButton'

// 컨테이너 스타일
const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1f2937 0%, #000000 100%);
  padding: 32px;
`

const MaxWidthContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 16px;
`

const Subtitle = styled.p`
  color: #9ca3af;
  font-size: 1.125rem;
  text-align: center;
  margin-bottom: 48px;
`

const Section = styled.section`
  margin-bottom: 64px;
`

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 32px;
`

const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(${({ columns = 3 }) => columns}, 1fr);
  }
`

const ButtonDemo = styled.div`
  text-align: center;
`

const DemoLabel = styled.p`
  color: #9ca3af;
  font-size: 0.875rem;
  margin-bottom: 12px;
`

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 32px;
`

const GuideSection = styled.div`
  background: rgba(31, 41, 55, 0.5);
  border-radius: 16px;
  padding: 32px;
`

const GuideGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`

const GuideTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  margin-bottom: 12px;
`

const GuideList = styled.ul`
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.6;

  li {
    margin-bottom: 8px;
  }
`

// 메인 컴포넌트
const ExamplePage = () => {
  const [loadingButtons, setLoadingButtons] = useState<Set<string>>(new Set())

  const handleLoadingClick = (buttonId: string) => {
    setLoadingButtons(prev => new Set(prev).add(buttonId))
    setTimeout(() => {
      setLoadingButtons(prev => {
        const newSet = new Set(prev)
        newSet.delete(buttonId)
        return newSet
      })
    }, 2000)
  }

  return (
    <Container>
      <MaxWidthContainer>
        <Title>버튼 컬렉션</Title>
        <Subtitle>다양한 버튼 디자인</Subtitle>

        {/* 색상 변형 */}
        <Section>
          <SectionTitle>색상 변형</SectionTitle>
          <Grid>
            <ButtonDemo>
              <DemoLabel>Original Dark</DemoLabel>
              <BaseButton variant="dark" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Original Orange</DemoLabel>
              <BaseButton variant="orange" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Blue Ocean</DemoLabel>
              <BaseButton variant="blue" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Forest Green</DemoLabel>
              <BaseButton variant="green" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Royal Purple</DemoLabel>
              <BaseButton variant="purple" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Cherry Pink</DemoLabel>
              <BaseButton variant="pink" />
            </ButtonDemo>
          </Grid>
        </Section>

        {/* 상태 변형 */}
        <Section>
          <SectionTitle>상태 변형</SectionTitle>
          <Grid columns={4}>
            <ButtonDemo>
              <DemoLabel>Normal</DemoLabel>
              <BaseButton variant="blue" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Disabled</DemoLabel>
              <BaseButton variant="blue" disabled />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Loading</DemoLabel>
              <BaseButton
                variant="green"
                loading={loadingButtons.has('demo-loading')}
                onClick={() => handleLoadingClick('demo-loading')}
              />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Success</DemoLabel>
              <BaseButton variant="green" icon={<IconLucideCheck size={16} />}>
                완료
              </BaseButton>
            </ButtonDemo>
          </Grid>
        </Section>

        {/* 크기 변형 */}
        <Section>
          <SectionTitle>크기 변형</SectionTitle>
          <FlexContainer>
            <ButtonDemo>
              <DemoLabel>Small</DemoLabel>
              <BaseButton variant="orange" size="small" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Medium</DemoLabel>
              <BaseButton variant="orange" size="medium" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Large</DemoLabel>
              <BaseButton variant="orange" size="large" />
            </ButtonDemo>
          </FlexContainer>
        </Section>

        {/* 특별한 호버 효과 */}
        <Section>
          <SectionTitle>특별한 호버 효과</SectionTitle>
          <Grid>
            <ButtonDemo>
              <DemoLabel>Glow Effect</DemoLabel>
              <BaseButton variant="cyan" hoverEffect="glow" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Bounce Effect</DemoLabel>
              <BaseButton variant="yellow" hoverEffect="bounce" />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Rotate Effect</DemoLabel>
              <BaseButton variant="red" hoverEffect="rotate" />
            </ButtonDemo>
          </Grid>
        </Section>

        {/* 아이콘과 함께 */}
        <Section>
          <SectionTitle>아이콘과 함께</SectionTitle>
          <Grid>
            <ButtonDemo>
              <DemoLabel>Heart Icon</DemoLabel>
              <BaseButton variant="pink" icon={<IconLucideHeart size={20} />} />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Star Icon</DemoLabel>
              <BaseButton variant="yellow" icon={<IconLucideStar size={20} />} />
            </ButtonDemo>
            <ButtonDemo>
              <DemoLabel>Download Icon</DemoLabel>
              <BaseButton variant="indigo" icon={<IconLucideDownload size={20} />} />
            </ButtonDemo>
          </Grid>
        </Section>

        {/* 사용 가이드 */}
        <GuideSection>
          <SectionTitle>사용 가이드</SectionTitle>
          <GuideGrid>
            <div>
              <GuideTitle>Props 사용법</GuideTitle>
              <GuideList>
                <li>
                  • <strong>variant</strong>: 'dark' | 'orange' | 'blue' | 'green' | 'purple' |
                  'pink' | 'cyan' | 'yellow' | 'red' | 'indigo'
                </li>
                <li>
                  • <strong>size</strong>: 'small' | 'medium' | 'large'
                </li>
                <li>
                  • <strong>hoverEffect</strong>: 'none' | 'glow' | 'bounce' | 'rotate'
                </li>
                <li>
                  • <strong>disabled</strong>: boolean
                </li>
                <li>
                  • <strong>loading</strong>: boolean
                </li>
                <li>
                  • <strong>fullWidth</strong>: boolean
                </li>
                <li>
                  • <strong>icon</strong>: React.ReactNode
                </li>
              </GuideList>
            </div>
            <div>
              <GuideTitle>사용 예시</GuideTitle>
              <GuideList>
                <li>• {'<BaseButton variant="blue" size="large" />'}</li>
                <li>• {'<BaseButton variant="green" loading={isLoading} />'}</li>
                <li>• {'<BaseButton variant="pink" hoverEffect="glow" />'}</li>
                <li>• {'<BaseButton variant="orange" icon={<Heart />} />'}</li>
                <li>• {'<BaseButton variant="purple" fullWidth />'}</li>
              </GuideList>
            </div>
          </GuideGrid>
        </GuideSection>
      </MaxWidthContainer>
    </Container>
  )
}
export default ExamplePage
