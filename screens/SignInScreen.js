import styled from 'styled-components/native';
import SignInCharacter from '../assets/SignInCharacter.png';
import SignInText_SALARY from '../assets/SignInText_SALARY.png';
import KakaoLoginBtn from '../assets/LoginBtns/Kakao_Login.png';
import NaverLoginBtn from '../assets/LoginBtns/Naver_Login.png';

const ViewContainer = styled.View`
  flex: 1;
  background-color: #000;
  padding: 0 35px;
`;

const TopTitleContainer = styled.View`
  margin-top: 120px;
`;

const SignInCharacterImage = styled.Image`
  resizemode: cover;
  width: 36px;
  height: 36px;
`;

const SubTitle = styled.Text`
  color: #d0d0d0;
  margin-top: 6px;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
`;

const BottomTitleContainer = styled.View`
  margin-top: 11px;
  width: 200px;
  height: 72px;
  position: relative;
`;

const MainTitle = styled.Text`
  color: #d7ff01;
  font-size: 34px;
  font-style: normal;
  font-weight: 700;
  position: absolute;
  z-index: 20;
`;

const MainTitleShadowImage = styled.Image`
  resize-mode: contain;
  width: 150px;
  position: absolute;
  z-index: 0;
  left: 8%;
  top: -32%;
  opacity: 0.2;
`;

const LoginBtnContainer = styled.View`
  margin-top: 180px;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

const TouchableImage = styled.TouchableOpacity``;

const KakaoBtn = styled.Image`
  resize-mode: contain;
  width: 300px;
  height: 52px;
`;

const NaverBtn = styled.Image`
  resize-mode: contain;
  width: 300px;
  height: 52px;
`;

function SignInScreen({ onEnter }) {
  return (
    <ViewContainer>
      <TopTitleContainer>
        <SignInCharacterImage source={SignInCharacter} />
        <SubTitle>하루 3분</SubTitle>
        <SubTitle>경제 한입,</SubTitle>
      </TopTitleContainer>
      <BottomTitleContainer>
        <MainTitle>샐러리</MainTitle>
        <MainTitleShadowImage source={SignInText_SALARY} />
      </BottomTitleContainer>
      <LoginBtnContainer>
        <TouchableImage onPress={onEnter}>
          <KakaoBtn source={KakaoLoginBtn} />
        </TouchableImage>
        <TouchableImage onPress={onEnter}>
          <NaverBtn source={NaverLoginBtn} />
        </TouchableImage>
      </LoginBtnContainer>
    </ViewContainer>
  );
}

export default SignInScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   LogInBtn: {
//     backgroundColor: '#ccc',
//     marginTop: 20,
//     height: 50,
//     width: 200,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   LogInBtnText: {
//     fontSize: 30,
//     color: '#000',
//   },
// });
