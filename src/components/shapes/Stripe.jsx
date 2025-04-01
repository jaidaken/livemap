import PropTypes from "prop-types";

function Stripe({ id, primary, secondary, stripeWidth = 10, size = 12 }) {
  return (
    <svg width="0" height="0">
      <defs>
        <pattern
          id={id}
          patternUnits="userSpaceOnUse"
          width={size}
          height={size}
          patternTransform="rotate(45)"
        >
          {/* Background fill */}
          <rect width={size} height={size} fill={primary} />
          {/* Diagonal stripe */}
          <line x1="0" y1="0" x2="0" y2={size} stroke={secondary} strokeWidth={stripeWidth} />
        </pattern>
      </defs>
    </svg>
  );
}

Stripe.propTypes = {
  id: PropTypes.string,
  primary: PropTypes.string,
  secondary: PropTypes.string,
  opacity: PropTypes.number,
  stripeWidth: PropTypes.number,
  size: PropTypes.number,
};

export default Stripe;
