export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <svg
        className="court-bg"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3">
          <rect x="60" y="80" width="1080" height="640" />
          <rect x="60" y="80" width="1080" height="260" />
          <rect x="60" y="460" width="1080" height="260" />
          <path d="M60 220c150 0 150 360 0 360" />
          <path d="M1140 220c-150 0-150 360 0 360" />
          <circle cx="600" cy="400" r="120" />
          <circle cx="600" cy="400" r="6" />
          <path d="M460 300h280v200H460z" />
          <circle cx="460" cy="400" r="60" />
          <circle cx="740" cy="400" r="60" />
          <path d="M300 300h80M300 500h80M820 300h80M820 500h80" />
        </g>
      </svg>

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
