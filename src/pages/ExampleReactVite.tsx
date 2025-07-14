// import { useState } from 'react'
// import styled, { keyframes } from 'styled-components'
// import reactLogo from '../assets/react.svg'
// import viteLogo from '/vite.svg'
//
// const spin = keyframes`
//     from {
//         transform: rotate(0deg);
//     }
//     to {
//         transform: rotate(360deg);
//     }
// `
//
// const Container = styled.div`
//     max-width: 1280px;
//     margin: 0 auto;
//     padding: 2rem;
//     text-align: center;
// `
//
// const Logos = styled.div`
//     display: flex;
//     justify-content: center;
//     gap: 1rem;
// `
//
// const Logo = styled.img`
//     height: 6em;
//     padding: 1.5em;
//     will-change: filter;
//     transition: filter 300ms;
//     &:hover {
//         filter: drop-shadow(0 0 2em #646cffaa);
//     }
// `
//
// const ReactLogo = styled(Logo)`
//     &:hover {
//         filter: drop-shadow(0 0 2em #61dafbaa);
//     }
//     @media (prefers-reduced-motion: no-preference) {
//         animation: ${spin} infinite 20s linear;
//     }
// `
//
// const Card = styled.div`
//     padding: 2em;
// `
//
// const Docs = styled.p`
//     color: #888;
// `
//
// export default function ExampleReactVite() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <Container>
//       <Logos>
//         <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
//           <Logo src={viteLogo} alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
//           <ReactLogo src={reactLogo} alt="React logo" />
//         </a>
//       </Logos>
//       <h1>Vite + React</h1>
//       <Card>
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/pages/ExampleReactVite.tsx</code> and save to test HMR
//         </p>
//       </Card>
//       <Docs>
//         Click on the Vite and React logos to learn more
//       </Docs>
//     </Container>
//   )
// }
