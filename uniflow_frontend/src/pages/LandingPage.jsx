import RegisterModal from '../components/RegisterModal.jsx';
import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import LoginModal from '../components/LoginModal.jsx';

function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  return (
    <div>
      LandingPage
      <Button onClick={() => setIsLoginOpen(true)}>Відкрити модальне вікно входу</Button>
      <Button onClick={() => setIsRegisterOpen(true)}>Відкрити модальне вікно реєстрації</Button>

      <LoginModal isOpen={isLoginOpen} onClose={()=> {setIsLoginOpen(false)}}/>
      <RegisterModal isOpen={isRegisterOpen} onClose={()=> {setIsRegisterOpen(false)}}/>
    </div>
  );
}

export default LandingPage;
