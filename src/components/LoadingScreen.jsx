export default function LoadingScreen({ fading }) {
  return (
    <div className={`loading-screen${fading ? ' fading' : ''}`}>
      <div className="loading-content">
        <div className="loading-ball">
          <img src="/logo.svg" alt="" />
        </div>
        <h1 className="loading-title">NBA Analytics</h1>
        <div className="loading-bar">
          <span className="loading-bar-fill" />
        </div>
      </div>
    </div>
  )
}
