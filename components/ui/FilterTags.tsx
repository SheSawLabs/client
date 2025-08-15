import { FilterTag } from "./FilterTag";
import { SortOrder } from "@/types/review";

const FilterTags = ({
  sortOrder,
  setSortOrder,
}: {
  sortOrder: SortOrder;
  setSortOrder: (order: SortOrder) => void;
}) => {
  return (
    <div className="flex gap-2">
      <FilterTag
        label="최신순"
        isActive={sortOrder === "recent"}
        onClick={() => setSortOrder("recent")}
      />
      <FilterTag
        label="등록순"
        isActive={sortOrder === "oldest"}
        onClick={() => setSortOrder("oldest")}
      />
    </div>
  );
};

export { FilterTags };
