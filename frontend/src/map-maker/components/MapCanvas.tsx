type MapCanvasProps = {
  width: number;
  height: number;
};



export default function MapCanvas({
  width,
  height,
}: MapCanvasProps) {
  return(
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${width}, 16px)`,
        gridTemplateRows: `repeat(${height}, 16px)`,
      }}
    >
        {Array.from(
          { length: width * height},
          (_, index) => (
            <div
              key={index}
              className="w-4 h-4 border border-solid border-zinc-800 box-border"
            />
          )
        )}
    </div>
  );
}