
import styled from 'styled-components';
import ChatContainer from './ChatContainer';
import Navbar from '../pages/navbar';

const WrapperContainer = styled.div`
  display: grid;
  height: 88vh;
  place-items: center;
`;

const Wrapper = () => {
    return (
    <>
        <Navbar />
        <WrapperContainer>
            <ChatContainer />
            
        </WrapperContainer>
    </>
        
    );
};

export default Wrapper;