import React from 'react';
import Svg, { Defs, LinearGradient, Stop, Circle, G, Path, Rect, Text as SvgText } from 'react-native-svg';

const Logo = ({ width = 120, height = 120 }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 120">
      <Defs>
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#667eea" stopOpacity="1" />
          <Stop offset="100%" stopColor="#764ba2" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="scissorsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#f093fb" stopOpacity="1" />
          <Stop offset="100%" stopColor="#f5576c" stopOpacity="1" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle cx="60" cy="60" r="55" fill="url(#logoGradient)" stroke="#ffffff" strokeWidth="2"/>
      
      {/* Scissors Icon */}
      <G transform="translate(35, 35)">
        {/* Left blade */}
        <Path d="M15 10 L25 20 L20 25 L10 15 Z" fill="url(#scissorsGradient)" stroke="#ffffff" strokeWidth="1"/>
        {/* Right blade */}
        <Path d="M35 10 L25 20 L30 25 L40 15 Z" fill="url(#scissorsGradient)" stroke="#ffffff" strokeWidth="1"/>
        {/* Handle circles */}
        <Circle cx="12" cy="12" r="4" fill="#ffffff" stroke="url(#scissorsGradient)" strokeWidth="2"/>
        <Circle cx="38" cy="12" r="4" fill="#ffffff" stroke="url(#scissorsGradient)" strokeWidth="2"/>
        {/* Center screw */}
        <Circle cx="25" cy="20" r="2" fill="#ffffff"/>
      </G>
      
      {/* Decorative elements */}
      <Circle cx="25" cy="25" r="2" fill="#ffffff" opacity="0.7"/>
      <Circle cx="95" cy="35" r="1.5" fill="#ffffff" opacity="0.5"/>
      <Circle cx="85" cy="85" r="2" fill="#ffffff" opacity="0.6"/>
      
      {/* Text placeholder area indicator */}
      <Rect x="20" y="85" width="80" height="20" rx="10" fill="rgba(255,255,255,0.2)" stroke="#ffffff" strokeWidth="1"/>
      <SvgText x="60" y="97" textAnchor="middle" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold">
        KUAFÖRÜM
      </SvgText>
    </Svg>
  );
};

export default Logo;