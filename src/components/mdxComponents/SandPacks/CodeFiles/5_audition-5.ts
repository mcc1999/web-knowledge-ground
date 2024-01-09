export const AppJS = `
import Counter from './Counter';
import RerenderCounter from './RerenderCounter';
import StaticComponent from './StaticComponent';
import './index.scss';

export default function App () {
  return (
    <div className="box">
      <Counter>
        <StaticComponent />
      </Counter>
      <RerenderCounter />
    </div>
  )
}
`

export const CounterJS = `
import { useState } from 'react';

export default function Counter ({children}) {
  const [count, setCount] = useState(0);
  console.log('Counter render')
  return (
    <div>
      <h2>No rerender count: {count}</h2>
      <button onClick={() => setCount(count+1)}>count++</button>
      {children}
    </div>
  )
}
`
export const RerenderCounterJS = `
import { useState } from 'react';
import StaticComponent from './StaticComponent';

export default function RerenderCounter () {
  const [count, setCount] = useState(0);
  console.log('Counter render')
  return (
    <div>
      <h2>Rerender count: {count}</h2>
      <button onClick={() => setCount(count+1)}>count++</button>
      <StaticComponent />
    </div>
  )
}
`
export const StaticComponentJS = `
import { useState } from 'react';

export default function StaticComponent () {
  console.log('StaticComponent render')
  return <h2>I am StaticComponent that don't need re-render.</h2>
}
`

export const IndexScss = `
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

`

const files = {
  '/App.js': { code: AppJS },
  '/Counter.js': { code: CounterJS },
  '/RerenderCounter.js': { code: RerenderCounterJS },
  '/StaticComponent.js': { code: StaticComponentJS },
  '/index.scss': { code: IndexScss },
}

export default files;