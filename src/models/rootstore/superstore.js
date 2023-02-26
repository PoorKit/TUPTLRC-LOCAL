import { types } from "mobx-state-tree";
import { createContext } from "react";

import User from "../user";

const SuperStoreModel = types.compose(
    "Superstore",
    types.model({
      user: types.array(User),
    })
);

const SuperStoreContext = createContext(SuperStoreModel.create({}));

export default SuperStoreContext;