const initialState = {
  savedSearch: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "SAVE_SEARCH":
      return {
        ...state,
        savedSearch: [...state.savedSearch, action.input],
      };
    case "DELETE_SEARCH":
      let searches = [...state.savedSearch];
      searches.splice(action.index, 1);
      return {
        ...state,
        savedSearch: searches,
      };
  }
  return state;
};

export default reducer;
