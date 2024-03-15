const fetchMenu = async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
    );
    const json = await response.json();
    return json.menu;
  } catch (error) {
    console.log("Fetch Menu Api Error:", error.message);
    throw error;
  }
};

export { fetchMenu };
