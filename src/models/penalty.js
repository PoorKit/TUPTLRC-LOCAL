import { types, flow, applySnapshot } from "mobx-state-tree";
import { createContext } from "react";

import { FetchPenalty } from "../services/api";

const Penalty = types.model("Penalty", {
    penalty: types.maybe(types.number),
    status: types.maybe(types.enumeration(["Unpaid", "Paid"])),
})
.actions(self => ({
    // Generate Axios Fetch to FetchPenalty in API.js
    fetchUserPenalty: flow(function*(userId) {
        try{
            const response = yield FetchPenalty(userId);
            if(response.penalties){
                const { penalty, status } = response.penalties;
                applySnapshot(self, { penalty, status });
            }else{
                applySnapshot(self,{ penalty: 0, status: undefined });
            }
        }catch(error){
            console.log(error);
        }
    }),
    // create a function that would set all the values inside the penalty object to undefined
    emptyout: flow(function*() {
        applySnapshot(self, { penalty: undefined, status: undefined });
    }),
    setTest(props){
        applySnapshot(self, { penalty: props.penalty, status: props.status });
    }

}))
.views(self => ({
    get userPenalty() {
        if (self.status === "Unpaid") {
            return self;
        } else {
            return null;
        }
    }
}))

const PenaltyContext = createContext(Penalty.create({}));

export default PenaltyContext;