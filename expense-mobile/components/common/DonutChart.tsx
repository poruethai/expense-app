import { Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export type DonutSlice = {
  key: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  data: DonutSlice[];
  size?: number;
  strokeWidth?: number;
  centerLabel?: string;
  centerValue?: string;
};

export function DonutChart({
  data,
  size = 180,
  strokeWidth = 26,
  centerLabel,
  centerValue,
}: DonutChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  let cumulative = 0;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          {total <= 0 ? (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#F3F4F6"
              strokeWidth={strokeWidth}
              fill="none"
            />
          ) : (
            data.map((slice) => {
              const fraction = slice.value / total;
              // เว้นช่องว่างเล็กน้อยระหว่างแต่ละสัดส่วนเพื่อให้แยกกันเห็นชัด
              const gap = data.length > 1 ? Math.min(4, circumference * 0.01) : 0;
              const segmentLength = Math.max(fraction * circumference - gap, 0);
              const dashArray = `${segmentLength} ${circumference - segmentLength}`;
              const dashOffset = -cumulative * circumference;

              cumulative += fraction;

              return (
                <Circle
                  key={slice.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            })
          )}
        </G>
      </Svg>

      {centerLabel || centerValue ? (
        <View
          style={{
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {centerValue ? (
            <Text
              style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {centerValue}
            </Text>
          ) : null}

          {centerLabel ? (
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              {centerLabel}
            </Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}