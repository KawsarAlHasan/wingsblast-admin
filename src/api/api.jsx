import { useState, useEffect } from "react";
import axios from "axios";

export const API = axios.create({
  baseURL: "https://wings-blast-backend.onrender.com/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// use admin
export const useAdminProfile = () => {
  const getAdminProfile = async () => {
    try {
      const response = await API.get("/admin/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      throw error;
    }
  };
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const adminProfile = await getAdminProfile();
        setAdmin(adminProfile);
      } catch (error) {
        setError("Failed to fetch admin profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminProfile();
  }, []);
  return { admin, loading, error };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// Category
export const useCategory = () => {
  const getCategory = async () => {
    try {
      const response = await API.get("/category/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching Category:", error);
      throw error;
    }
  };

  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getCategory();
        setCategory(categoryData.data);
      } catch (error) {
        setError("Failed to fetch Category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  return { category, loading, error };
};

// Flavor
export const useFlavor = () => {
  const getFlavor = async () => {
    try {
      const response = await API.get("/flavor/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching Flavor:", error);
      throw error;
    }
  };

  const [flavor, setFlavor] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlavor = async () => {
      try {
        const flavorData = await getFlavor();
        setFlavor(flavorData.data);
      } catch (error) {
        setError("Failed to fetch Flavor.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlavor();
  }, []);

  return { flavor, loading, error };
};

// Dip
export const useDip = () => {
  const getDip = async () => {
    try {
      const response = await API.get("/dip/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching Dip:", error);
      throw error;
    }
  };

  const [dip, setDip] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDip = async () => {
      try {
        const dipData = await getDip();
        setDip(dipData.data);
      } catch (error) {
        setError("Failed to fetch dip.");
      } finally {
        setLoading(false);
      }
    };

    fetchDip();
  }, []);

  return { dip, loading, error };
};

// Drink
export const useDrink = () => {
  const getDrink = async () => {
    try {
      const response = await API.get("/drink/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching drink:", error);
      throw error;
    }
  };

  const [drink, setDrink] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDrink = async () => {
      try {
        const drinkData = await getDrink();
        setDrink(drinkData.data);
      } catch (error) {
        setError("Failed to fetch drink.");
      } finally {
        setLoading(false);
      }
    };

    fetchDrink();
  }, []);

  return { drink, loading, error };
};

// Beverage
export const useBeverage = () => {
  const getBeverage = async () => {
    try {
      const response = await API.get("/beverage/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching beverage:", error);
      throw error;
    }
  };

  const [beverage, setBeverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBeverage = async () => {
      try {
        const beverageData = await getBeverage();
        setBeverage(beverageData.data);
      } catch (error) {
        setError("Failed to fetch beverage.");
      } finally {
        setLoading(false);
      }
    };

    fetchBeverage();
  }, []);

  return { beverage, loading, error };
};

// Side
export const useSide = () => {
  const getSide = async () => {
    try {
      const response = await API.get("/side/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching side:", error);
      throw error;
    }
  };

  const [side, setSide] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSide = async () => {
      try {
        const sideData = await getSide();
        setSide(sideData.data);
      } catch (error) {
        setError("Failed to fetch side.");
      } finally {
        setLoading(false);
      }
    };

    fetchSide();
  }, []);

  return { side, loading, error };
};

// Not use this project
// get projects
export const useProjects = (courseID) => {
  const getProjects = async () => {
    try {
      const response = await API.get(`/project/all/${courseID}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  };

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
      } catch (error) {
        setError("Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [courseID]);

  return { projects, loading, error };
};
