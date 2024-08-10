import { FC } from "react";
import { DataEntry } from "../../lib/interfaces";
import Card from "../card/Card";
import ErrorBoundary from "./ErrorBoundary";

interface DetailedViewProps {
  place: DataEntry;
  goBack: () => void;
}

export const DetailedView: FC<DetailedViewProps> = ({ place, goBack }) => {
  return (
    <ErrorBoundary fallback={'Cant Load Place'}>
      <div className="DetailedView">
        <button onClick={goBack}>Back</button>
        <Card cardData={place} />
      </div>
    </ErrorBoundary>
  );
}
