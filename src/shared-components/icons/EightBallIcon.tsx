import React from "react";

interface MyIconProps {
  color?: string;
  width?: string | number;
  height?: string | number;
}

const EightBallIcon: React.FC<MyIconProps> = ({
  color = "inherit",
  width = 24,
  height = 24,
}) => (
  <svg
    version="1.0"
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 512.000000 512.000000"
    preserveAspectRatio="xMidYMid meet"
  >
    <g
      transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
      fill={color}
      stroke="none"
    >
      <path
        d="M2340 4709 c-563 -58 -1094 -346 -1456 -789 -464 -568 -603 -1330
-373 -2034 108 -330 283 -612 534 -862 504 -499 1237 -721 1930 -583 599 120
1103 472 1430 999 198 319 315 736 315 1120 0 384 -117 801 -315 1120 -292
470 -730 806 -1244 954 -263 76 -553 102 -821 75z m390 -1044 c235 -35 449
-144 620 -315 340 -340 425 -845 216 -1275 -273 -561 -935 -792 -1491 -521
-232 114 -403 283 -519 513 -208 416 -127 935 199 1268 261 266 613 385 975
330z"
      />
      <path
        d="M2422 3345 c-105 -23 -208 -79 -283 -154 -76 -76 -116 -150 -132
-245 -20 -119 17 -249 98 -344 l37 -42 -37 -42 c-49 -58 -84 -134 -98 -212
-48 -282 219 -546 553 -546 215 0 432 124 514 292 75 154 52 336 -59 466 l-37
42 37 42 c81 95 118 225 98 344 -16 95 -56 169 -132 245 -139 139 -354 198
-559 154z m239 -322 c60 -19 124 -75 134 -116 23 -92 -96 -187 -235 -187 -69
0 -148 29 -191 70 -64 61 -64 119 0 180 68 65 187 87 292 53z m0 -640 c60 -19
124 -75 134 -116 11 -42 -3 -78 -44 -117 -96 -91 -286 -91 -382 0 -64 61 -64
119 0 180 68 65 187 87 292 53z"
      />
    </g>
  </svg>
);

export default EightBallIcon;