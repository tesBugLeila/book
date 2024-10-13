import React, { useState, useEffect } from "react"; 
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

function ProductFilters({ categories, onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [isExpanded, setIsExpanded] = useState(false); 

  useEffect(() => {
    onFilterChange({ selectedCategory, sortOption });
  }, [selectedCategory, sortOption, onFilterChange]);

  const toggleFilters = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleClickOutside = (e) => {
    e.stopPropagation(); 
  };

  return (
    <div className="filters-container" onClick={toggleFilters}>
      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      {isExpanded && (
        <div className="filters-content" onClick={handleClickOutside}>
          <div className="filter-option">
            <label htmlFor="category">Категория:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-option">
            <label htmlFor="sort">Сортировать по:</label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">По умолчанию</option>
              <option value="price">Цене</option>
              <option value="rating">Рейтингу</option>
              <option value="author">Автору</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductFilters;
