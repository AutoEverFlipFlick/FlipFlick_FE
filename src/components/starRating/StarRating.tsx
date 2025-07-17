import styled from "styled-components";
import React from "react";

type StarRatingProps = {
  rating: number; // 0.0 ~ 5.0
  size?: number;
};

const StarWrapper = styled.div`
    display: flex;
    gap: 4px;
`;

const getSvgSize = (size?: number) => `${size ?? 20}px`;

const StyledSvg = styled.svg<{ $size?: number }>`
    width: ${({ $size }) => getSvgSize($size)};
    height: ${({ $size }) => getSvgSize($size)};
    stroke: gold;
    stroke-width: 0.8;
    stroke-linejoin: round;
    stroke-linecap: round;
    shape-rendering: geometricPrecision;
`;

const FilledStar = styled(StyledSvg)`
    fill: gold;
`;

const EmptyStyledSvg = styled(StyledSvg)`
    fill: none;
`;

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 20 }) => {
  const renderStar = (index: number) => {
    const filled = rating - index;

    const starPath =
      'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21L12 17.77L5.82 21L7 14.14L2 9.27L8.91 8.26L12 2Z';
    const transform = 'scale(4.1667)'; // 100 / 24 = 4.1667

    if (filled >= 1) {
      return (
        <FilledStar viewBox="0 0 100 100" key={index} $size={size}>
          <path d={starPath} transform={transform} />
        </FilledStar>
      );
    } else if (filled >= 0.5) {
      return (
        <StyledSvg viewBox="0 0 100 100" key={index} $size={size}>
          <defs>
            <mask id={`half-mask-${index}`}>
              <rect x="0" y="0" width="50" height="100" fill="white" />
            </mask>
          </defs>

          {/* outline */}
          <path d={starPath} fill="none" stroke="gold" transform={transform} />

          {/* half filled */}
          <path
            d={starPath}
            fill="gold"
            stroke="gold"
            mask={`url(#half-mask-${index})`}
            transform={transform}
          />
        </StyledSvg>
      );
    } else {
      return (
        <EmptyStyledSvg viewBox="0 0 100 100" key={index} $size={size}>
          <path d={starPath} transform={transform} />
        </EmptyStyledSvg>
      );
    }
  };

  return <StarWrapper>{[0, 1, 2, 3, 4].map(renderStar)}</StarWrapper>;
};

export default StarRating;
