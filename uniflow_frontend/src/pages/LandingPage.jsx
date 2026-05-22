import styled, { keyframes } from 'styled-components';
import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import LoginModal from '../components/modals/LoginModal.jsx';
import RegisterModal from '../components/modals/RegisterModal.jsx';
import LogoIcon from '../assets/Logo.svg?react';

// асети
import MainScreen from '../assets/landing/Головна сторінка.png';
import QueueScreen from '../assets/landing/Сторінка черги(активний запис, користувач записався).png';
import QueueScreen2 from '../assets/landing/Сторінка черги(активний запис, користувач не  записався).png';
import QueuesOverview from '../assets/landing/Сторінка черг(1 частина).png';
import SubjectsScreen from '../assets/landing/Сторінка предметів.png';
import CalendarScreen from '../assets/landing/Головна сторінка.png';

function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <PageWrapper>
      <Navbar>
        <NavbarInner>
          <LogoIcon width="4rem" height="4rem" />
          <NavActions>
            <Button variant="secondary" onClick={() => setIsLoginOpen(true)}>
              Увійти
            </Button>
            <Button onClick={() => setIsRegisterOpen(true)}>
              Зареєструватися
            </Button>
          </NavActions>
        </NavbarInner>
      </Navbar>

      <HeroSection>
        <HeroContent>
          <HeroTitle>Навчання без хаосу</HeroTitle>
          <HeroButtons>
            <Button size="lg" onClick={() => setIsLoginOpen(true)}>
              Увійти в кабінет
            </Button>
          </HeroButtons>
          <HeroMainImageWrapper>
            <img src={MainScreen} alt="Main Interface" />
          </HeroMainImageWrapper>
        </HeroContent>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>Інструменти для продуктивного навчання</SectionTitle>
        <FeaturesGrid>
          <FeatureCard className="large">
            <FeatureInfo>
              <FeatureTitle>Розумна черга</FeatureTitle>
              <FeatureDesc>
                Система пріоритетів на базі токенів. Справедливий розподіл місць
                без суперечок у чатах.
              </FeatureDesc>
            </FeatureInfo>
            <QueueImagesGrid>
              <LargeImageWrapper>
                <img src={QueueScreen} alt="Active Queue" />
              </LargeImageWrapper>
              <SmallImagesRow>
                <SmallImageWrapper>
                  <img src={QueueScreen2} alt="Queue Registration" />
                </SmallImageWrapper>
                <SmallImageWrapper>
                  <img src={QueuesOverview} alt="Queues List" />
                </SmallImageWrapper>
              </SmallImagesRow>
            </QueueImagesGrid>
          </FeatureCard>

          <FeatureCard className="right-card">
            <FeatureInfo align="right">
              <FeatureTitle>База знань</FeatureTitle>
              <FeatureDesc>
                Вся інформація про предмети зібрана в одному місці
              </FeatureDesc>
            </FeatureInfo>
            <RightImageWrapper>
              <img src={SubjectsScreen} alt="Subjects List" />
            </RightImageWrapper>
          </FeatureCard>

          <FeatureCard className="bottom-card">
            <FeatureInfo>
              <FeatureTitle>Календар подій</FeatureTitle>
              <FeatureDesc>
                Всі події, дедлайни, черги в одному місці
              </FeatureDesc>
            </FeatureInfo>
            <BottomImageWrapper>
              <img src={CalendarScreen} alt="Calendar View" />
            </BottomImageWrapper>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <Footer>
        <LogoIcon width="4rem" height="4rem" />
        <FooterInfo>Робота Постольного Давида</FooterInfo>
      </Footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--base-white);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Navbar = styled.nav`
  position: fixed;
  top: 1rem;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 0 2rem;
  display: flex;
  justify-content: center;
`;

const NavbarInner = styled.div`
  width: 100%;
  max-width: 86rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 1.5rem;
  padding: 0.75rem 1.5rem;

  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
`;

const NavActions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const gradientanimateHero = keyframes`
    0%   { background-position: 0 50%; }
    25%  { background-position: 100% 0; }
    50%  { background-position: 100% 100%; }
    75%  { background-position: 0 100%; }
    100% { background-position: 0 50%; }
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 57.625rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding-top: 5rem;

  background-color: var(--base-white);
  background-image:
    radial-gradient(circle at 100% 0%,   rgba(4, 198, 93, 0.85),  transparent 60%),
    radial-gradient(circle at 0%   50%,  rgba(0, 126, 255, 0.6),  transparent 60%),
    radial-gradient(circle at 100% 100%, rgba(255, 219, 77, 0.8), transparent 55%),
    radial-gradient(circle at 50%  50%,  rgba(100, 128, 109, 0.3), transparent 70%);
  background-size: 200% 200%;
  animation: ${gradientanimateHero} 12s ease infinite;
`;



const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
  gap: 1rem;
  width: 100%;
  max-width: 90rem;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem; // 56px
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  line-height: 3.75rem;
  letter-spacing: -0.07rem;
  text-align: center;
  margin: 0;
  color: var(--base-black);
  white-space: nowrap;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const HeroMainImageWrapper = styled.div`
  width: 58rem; // ~928px
  height: 36.56rem; // ~585px
  margin-top: 1rem;
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  background: var(--base-white);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
  }
`;

const FeaturesSection = styled.section`
  width: 100%;
  max-width: 90rem; // 1440px
  padding: 2rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.75rem; // 28px
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  line-height: 2rem;
  letter-spacing: -0.035rem;
  text-align: center;
  color: var(--base-black);
  margin-bottom: 1.375rem;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 16rem); // 256px
  gap: 0.625rem; // 10px
  width: 100%;
`;

const FeatureCard = styled.div`
  border: 2px solid var(--base-bright-grey);
  border-radius: 1.25rem; // 20px
  padding: 2rem 0.625rem;
  display: flex;
  flex-direction: column;
  background: var(--base-white);
  overflow: hidden;

  &.large {
    grid-column: 1 / span 2;
    grid-row: 1 / span 4;
    padding-bottom: 6rem; // 96px
  }

  &.right-card {
    grid-column: 3 / span 2;
    grid-row: 1 / span 2;
    padding: 0.5rem 0.625rem;
    align-items: flex-end;
  }

  &.bottom-card {
    grid-column: 3 / span 2;
    grid-row: 3 / span 2;
    padding: 0.5rem 0.625rem;
  }
`;

const FeatureInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: ${(props) => props.align || 'left'};
  align-items: ${(props) =>
    props.align === 'right' ? 'flex-end' : 'flex-start'};
  width: 100%;
  margin-bottom: 1.5rem;
`;

const FeatureTitle = styled.h4`
  font-size: 2.375rem; // 38px
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 400;
  line-height: 2.5rem;
  margin: 0;
  color: var(--base-black);
`;

const FeatureDesc = styled.p`
  font-size: 1rem;
  font-family: 'e-Ukraine', sans-serif;
  font-weight: 300;
  line-height: 1.5rem;
  letter-spacing: -0.02rem;
  color: var(--base-black);
`;

const QueueImagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: auto;
  width: 42.93rem; // 687px
`;

const LargeImageWrapper = styled.div`
  width: 100%;
  height: 20.68rem;
  border-radius: 1rem;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 0.5px solid var(--base-bright-grey);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
  }
`;

const SmallImagesRow = styled.div`
  display: flex;
  gap: 0.625rem;
  width: 100%;
`;

const SmallImageWrapper = styled.div`
  flex: 1;
  height: 19.375rem;
  border-radius: 1rem;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 0.5px solid var(--base-bright-grey);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
  }
`;

const RightImageWrapper = styled.div`
  width: 100%;
  height: 23.625rem;
  border-radius: 1rem;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 0.5px solid var(--base-bright-grey);
  margin-top: auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
  }
`;

const BottomImageWrapper = styled.div`
  width: 100%;
  height: 23.8rem;
  border-radius: 1rem;
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.2);
  overflow: hidden;
  border: 0.5px solid var(--base-bright-grey);
  margin-top: auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top left;
  }
`;

const Footer = styled.footer`
  width: 100%;
  max-width: 90rem;
  padding: 2rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid var(--base-bright-grey);
  margin-top: 4rem;
`;

const FooterInfo = styled.p`
  font-size: 1rem;
  color: var(--base-secondary-text);
  font-family: 'e-Ukraine', sans-serif;
`;

export default LandingPage;
