self.onmessage = function (e) {
  const { allSystems, bounds, activeFilters } = e.data;

  const filtered = allSystems.filter(
    ({ latitude, longitude, isCanon, isLegends }) => {
      const inView =
        latitude <= bounds.north &&
        latitude >= bounds.south &&
        longitude <= bounds.east &&
        longitude >= bounds.west;
      const matchesFilter =
        (isCanon && activeFilters.includes("canon")) ||
        (isLegends && activeFilters.includes("legends"));

      return inView && matchesFilter;
    }
  );

  self.postMessage(filtered);
};
