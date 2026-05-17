import React from "react";
import { SignInButton, SignUpButton } from "@clerk/react";
import { MetalText } from "../components/shared/MetalText";
import { COLORS } from "../constants/Colors";

function SignInCta({
  className,
  style,
  children,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <SignInButton mode="modal">
      <button type="button" className={className} style={style}>
        {children}
      </button>
    </SignInButton>
  );
}

const LandingPage: React.FC = () => {
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
          <SignInCta className="btn-sleek landing-login-btn">Login</SignInCta>
          <SignUpButton mode="modal">
            <button type="button" className="btn-sleek btn-sleek-dark ms-2">
              Sign up
            </button>
          </SignUpButton>
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
          <ul className="landing-hero-points">
            <li>No real money risk</li>
            <li>Live stock and options workflows</li>
            <li>Built-in portfolio and backtest tooling</li>
          </ul>
          <div className="landing-hero-actions">
            <SignInCta
              className="btn-sleek btn-sleek-green"
              style={{ color: COLORS.appBackground }}
            >
              Start Paper Trading
            </SignInCta>
            <a href="#features" className="btn-sleek btn-sleek-dark">
              Explore Features
            </a>
          </div>
          <p className="landing-cta-note">
            Free tier available. Upgrade anytime as you scale.
          </p>
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
                Test portfolios with historical data to validate ideas before
                live deployment.
              </p>
            </article>
          </div>
        </section>

        <section
          id="pricing"
          className="landing-section landing-reveal landing-reveal-3"
        >
          <h2>Choose Your Plan</h2>
          <p className="landing-pricing-subtext">
            Start free, then upgrade when you need more symbols, analytics, and
            strategy depth.
          </p>
          <div className="landing-grid landing-pricing-grid">
            <article className="landing-price-card">
              <div className="landing-price-top">
                <h3>Free</h3>
                <p className="landing-price">$0</p>
                <p className="landing-price-fit">Best for first-time users</p>
              </div>
              <ul className="landing-price-features">
                <li>Stock data only</li>
                <li>No fundamental data</li>
                <li>Track up to 10 symbols</li>
                <li>1 portfolio</li>
                <li>No options</li>
                <li>No backtesting</li>
              </ul>
              <SignInCta className="btn-sleek btn-sleek-dark w-100 landing-price-cta">
                GET FREE
              </SignInCta>
            </article>
            <article className="landing-price-card landing-price-card-featured">
              <span className="landing-badge">Most Popular</span>
              <div className="landing-price-top">
                <h3>Basic</h3>
                <p className="landing-price">$19/mo</p>
                <p className="landing-price-fit">$15/mo billed annually</p>
              </div>
              <ul className="landing-price-features">
                <li>Stock and options data</li>
                <li>No options greeks</li>
                <li>Fundamental data</li>
                <li>Track up to 60 symbols</li>
                <li>Up to 3 portfolios</li>
                <li>Backtesting capabilities</li>
              </ul>
              <SignInCta
                className="btn-sleek btn-sleek-green w-100 landing-price-cta"
                style={{ color: COLORS.appBackground }}
              >
                CHOOSE BASIC
              </SignInCta>
            </article>
            <article className="landing-price-card">
              <div className="landing-price-top">
                <h3>Pro</h3>
                <p className="landing-price">$49/mo</p>
                <p className="landing-price-fit">$45/mo billed annually</p>
              </div>
              <ul className="landing-price-features">
                <li>Stock and options data</li>
                <li>Options greeks</li>
                <li>Fundamental data</li>
                <li>Customizable health metrics</li>
                <li>Stock screeners</li>
                <li>Track up to 100 symbols</li>
                <li>Up to 10 portfolios</li>
                <li>Backtesting capabilities</li>
              </ul>
              <SignInCta className="btn-sleek w-100 landing-price-cta">
                GO PRO
              </SignInCta>
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
        <SignInCta
          className="btn-sleek btn-sleek-green"
          style={{ color: COLORS.appBackground }}
        >
          Start Now
        </SignInCta>
      </footer>
    </div>
  );
};

export default LandingPage;
