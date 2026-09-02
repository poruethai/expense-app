import { Text, View } from 'react-native';

export type TrendBarChartItem = {
  label: string;
  value: number;
  highlighted?: boolean;
};

type TrendBarChartProps = {
  data: TrendBarChartItem[];
  color?: string;
  highlightColor?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
};

export function TrendBarChart({
  data,
  color = '#93C5FD',
  highlightColor = '#2563EB',
  height = 90,
  valueFormatter,
}: TrendBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barAreaHeight = height - 34; // เผื่อพื้นที่ label ตัวเลขด้านบน + label เดือนด้านล่าง

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        height,
        gap: 6,
      }}
    >
      {data.map((item, index) => {
        const barHeight = Math.max((item.value / max) * barAreaHeight, 2);

        return (
          <View key={index} style={{ flex: 1, alignItems: 'center' }}>
            {item.value > 0 ? (
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 9,
                  color: item.highlighted ? '#111827' : '#9CA3AF',
                  fontWeight: item.highlighted ? '700' : '500',
                  marginBottom: 4,
                }}
              >
                {valueFormatter ? valueFormatter(item.value) : item.value}
              </Text>
            ) : (
              <View style={{ height: 15 }} />
            )}

            <View
              style={{
                width: '70%',
                height: barHeight,
                borderRadius: 4,
                backgroundColor: item.highlighted ? highlightColor : color,
              }}
            />

            <Text
              style={{
                fontSize: 10,
                color: item.highlighted ? '#111827' : '#9CA3AF',
                fontWeight: item.highlighted ? '700' : '500',
                marginTop: 6,
              }}
            >
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
