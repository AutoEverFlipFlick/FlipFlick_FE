// src/component/starRating/StartRating.tsx
import styled from 'styled-components'
import React from 'react'

type StarRatingProps = {
  rating: number; // 0.0 ~ 5.0
  size?: number;
};

const StarWrapper = styled.div`
  display: flex;
  gap: 4px;
`;

const getSvgSize = (size?: number) => `${size ?? 20}px`

const StyledSvg = styled.svg<{ $size?: number }>`
  width: ${({ $size }) => getSvgSize($size)};
  height: ${({ $size }) => getSvgSize($size)};
  stroke: gold;
  stroke-width: 0.8;
  stroke-linejoin: round;
  stroke-linecap: round;
  shape-rendering: geometricPrecision;
`;

// const FilledStar = styled(StyledSvg)`
//   fill: gold;
// `
//
// const EmptyStyledSvg = styled(StyledSvg)`
//   fill: none;
// `

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 20 }) => {
    const starPath =
      'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z'
    const transform = 'scale(4.1667)'; // 100 / 24 = 4.1667

    const renderStar = (index: number) => {
      const filled = Math.max(0, Math.min(1, rating - index)) // clamp to [0,1]
      const fillPercentage = filled * 100

      return (
        <StyledSvg viewBox="0 0 100 100" key={index} $size={size}>
          <defs>
            <linearGradient id={`grad-${index}`}>
              <stop offset={`${fillPercentage}%`} stopColor="gold" />
              <stop offset={`${fillPercentage}%`} stopColor="white" />
            </linearGradient>
            <mask id={`mask-${index}`}>
              <rect x="0" y="0" width="100" height="100" fill={`url(#grad-${index})`} />
            </mask>
          </defs>

          {/* outline */}
          <path d={starPath} fill="none" stroke="gold" transform={transform} />

          {/* fill with mask */}
          <path
            d={starPath}
            fill="gold"
            stroke="gold"
            transform={transform}
            mask={`url(#mask-${index})`}
          />
        </StyledSvg>
      );
    };

    return <StarWrapper>{[0, 1, 2, 3, 4].map(renderStar)}</StarWrapper>
  }

  export default StarRating
