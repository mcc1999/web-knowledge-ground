export const AppJS = `
import { useEffect } from 'react';
import './index.scss';

export default function App () {
  useEffect(() => {
    document.getElementsByTagName('html')[0]
      .setAttribute('data-theme', 'light');
  }, [])

  function toggleTheme() {
    const HtmlElement = document.getElementsByTagName('html')[0]
    if (HtmlElement.getAttribute('data-theme') === 'light') HtmlElement.setAttribute('data-theme', 'dark');
    else HtmlElement.setAttribute('data-theme', 'light');
  }

  return (
    <div className="box">
      <div><button onClick={toggleTheme}>切换主题</button></div>
      <div>I am text!</div>
      <div>Red in Light Mode!</div>
      <div>Green in Dark Mode!</div>
    </div>
  )
}
`

export const IndexScss = `
@import './theme.scss';

.box {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  @include useTheme {
    background-color: getVar('bgColor');
    color: getVar('textColor')
  }
}

`
export const ThemeScss = `
$themes: (
  light: (
    bgColor: #eee,
    textColor: red,
  ),
  dark: (
    bgColor: #000,
    textColor: green,
  ),
);

$curTheme: light;

@mixin useTheme() {
  @each $key, $value in $themes {
    $curTheme: $key !global;
    html[data-theme='#{$key}'] & {
      @content;
    }
  }
}

@function getVar($key) {
  $themeMap: map-get($themes, $curTheme);
  @return map-get($themeMap, $key);
}
`

const files = {
  '/App.js': { code: AppJS },
  '/index.scss': { code: IndexScss },
  '/theme.scss': { code: ThemeScss, readonly: true },
}

export default files;