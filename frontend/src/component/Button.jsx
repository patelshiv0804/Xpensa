import styled from 'styled-components';

const StyledButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding: 15px;
  border: 4px solid;
  border-color: transparent;
  font-size: 16px;
  background-color: inherit;
  width:100px;
  height:35px;
  border-radius: 100px;
  font-weight: 600;
  color: rgb(0 0 0);
  box-shadow: 0 0 0 2px rgb(145 74 12);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  svg {
    position: absolute;
    width: 24px;
    fill: rgb(145 74 12);
    z-index: 9;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .arr-1 {
    right: 5px;
  }

  .arr-2 {
    left: -25%;
  }

  .circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background-color: rgb(145 74 12);
    border-radius: 50%;
    opacity: 0;
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .text {
    position: relative;
    z-index: 1;
    transform: translateX(-12px);
    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  &:hover {
    box-shadow: 0 0 0 12px transparent;
    color: #212121;
    border-radius: 12px;
    color : white ;
    height : 45px ;
  }

  &:hover .arr-1 {
    right: -25%;
  }

  &:hover .arr-2 {
    left: 1px;
  }

  &:hover .text {
    transform: translateX(12px);
  }

  &:hover svg {
    fill: #ffa658;
  }

  &:active {
    scale: 0.95;
    box-shadow: 0 0 0 4px greenyellow;
  }

  &:hover .circle {
    width: 220px;
    height: 220px;
    opacity: 1;
  }
`;

const Button = ({ onClick, text }) => {
  return (
    <StyledButton onClick={onClick}>
      <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
      <span className="text">{text} </span>
      <span className="circle" />
      <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z" />
      </svg>
    </StyledButton>
  );
};

export default Button;
