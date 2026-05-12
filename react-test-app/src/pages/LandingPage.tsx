import React from "react";
import { MetalText } from "../components/shared/MetalText";
import { COLORS } from "../constants/Colors";

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  return (
    <div className="landing-page">
      <header className="landing-header landing-reveal landing-reveal-0">
        <div className="landing-brand">
          <MetalText
            children="QUANTAE DIVITIAE"
            className="card-title mb-0"
            fontSize="1rem"
          />
        </div>
        <nav className="landing-nav">
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <button
            className="btn-sleek landing-login-btn"
            onClick={onLoginClick}
          >
            Login
          </button>
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero landing-reveal landing-reveal-1">
          <p className="landing-kicker">Paper Trading Platform</p>
          <h1>Practice stock and options trading with simulated capital.</h1>
          <p className="landing-subtext">
            Real-time market data, stock fundamentals, options analytics, and
            portfolio execution tools built for realistic paper trading without
            risking real money.
          </p>
          <div className="landing-hero-actions">
            <button className="btn-sleek" onClick={onLoginClick}>
              Start Paper Trading
            </button>
            <a href="#features" className="btn-sleek btn-sleek-dark">
              Explore Features
            </a>
          </div>
        </section>

        <section
          id="features"
          className="landing-section landing-reveal landing-reveal-2"
        >
          <h2>Feature Depth</h2>
          <div className="landing-grid">
            <article className="landing-feature-card">
              <h3>Live Market Workspace</h3>
              <p>
                Stream stock and options data with responsive views for fast
                symbol switching and execution.
              </p>
            </article>
            <article className="landing-feature-card">
              <h3>Execution + Position Controls</h3>
              <p>
                Size by shares, dollar amount, or portfolio percentage and
                monitor projected impact before placing simulated orders.
              </p>
            </article>
            <article className="landing-feature-card">
              <h3>Portfolio Insights</h3>
              <p>
                Track open and closed positions, allocation balance, and
                performance trends in one dashboard.
              </p>
            </article>
            <article className="landing-feature-card">
              <h3>Backtesting Flows</h3>
              <p>
                Test strategies with historical data to validate ideas before
                live deployment.
              </p>
            </article>
          </div>
        </section>

        <section
          id="pricing"
          className="landing-section landing-reveal landing-reveal-3"
        >
          <h2>Tier Breakdown</h2>
          <div className="landing-grid">
            <article className="landing-price-card">
              <h3>Free</h3>
              <p className="landing-price">$0</p>
              <p>
                Delayed data (15 min), no options flow, limited to 5 watchlist
                symbols, no backtesting.
              </p>
            </article>
            <article className="landing-price-card landing-price-card-featured">
              <h3>Basic</h3>
              <p className="landing-price">$15/mo</p>
              <p>
                Real-time quotes, 25 symbols, basic fundamentals (P/E, market
                cap). Three Portfolios, no options greeks, no DCF/intrinsic
                value, no backtesting.
              </p>
            </article>
            <article className="landing-price-card">
              <h3>Pro</h3>
              <p className="landing-price">$40/mo</p>
              <p>
                Unlimited symbols, full options chain + greeks streaming, full
                fundamental suite, backtesting, earnings calendar, sector, 10
                portfolios.
              </p>
            </article>
          </div>
        </section>

        <section
          id="about"
          className="landing-section landing-reveal landing-reveal-4"
        >
          <h2>About the Company</h2>
          <div className="landing-about-card">
            <p>
              Quantae Divitiae is a paper trading platform that allows users to
              trade stocks and options in a realistic environment. We combine
              clean design, high-signal data, and practical execution tooling to
              help users make faster, better decisions. Get access to our
              platform by logging in or signing up for a free account. Some
              features are still a work in progress.
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-footer landing-reveal landing-reveal-5">
        <button
          className="btn-sleek btn-sleek-green"
          style={{ color: COLORS.appBackground }}
          onClick={onLoginClick}
        >
          Login to Continue
        </button>
      </footer>
    </div>
  );
};

export default LandingPage;
