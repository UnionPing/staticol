import {isNumber} from "util";

type Constructor = new (...args: any[]) => {};

export type staticolID = number | string;

export function staticol<TBase extends Constructor>(Base: TBase) {
    return class derivedBase extends Base {
        static _collection: { [id: staticolID]: derivedBase } = {};

        /**
         * get all items in the collection
         * @returns {derivedBase[]}
         */
        static all(): derivedBase[] {
            return Object.values(this._collection);
        }

        /**
         * get all id's inside the collection
         * @returns {staticolID[]}
         */
        static all_IDs(): staticolID[] {
            return Object.keys(this._collection);
        }

        /**
         * get a copy of the current collection as a staticol-ID => item mapped object
         * @returns {{[p: staticolID]: derivedBase}}
         */
        static all_assoc(): { [id: staticolID]: derivedBase } {
            return {...this._collection};
        }

        /**
         * test if the given id is in the collection
         * @param {staticolID} id
         * @returns {boolean}
         */
        static has(id: staticolID): boolean {
            return id in this._collection;
        }

        /**
         * retrieves an item if the given id already exists
         * @param {staticolID} id
         * @returns {derivedBase | null}
         */
        static get(id: staticolID): derivedBase | null {
            return id in this._collection ? this._collection[id] : null;
        }

        /**
         * het an item if it exists or creates a new one for the collection and return the newly constructed item
         * @param {staticolID} id
         * @param constructorData
         * @returns {derivedBase}
         */
        static item(id: staticolID, ...constructorData: any[]): derivedBase {
            return id in this._collection ?
                this._collection[id] :
                (this._collection[id] = new derivedBase(...constructorData));
        }


        static remove(idOrItem: staticolID | derivedBase): boolean {
            if (typeof idOrItem == "number" || typeof idOrItem == "string") {
                if (idOrItem in this._collection) {
                    delete this._collection[idOrItem];
                    return true;
                }
                return false;
            }


            let deleted = false;
            for (const id in this._collection) {
                if (this._collection[id] === idOrItem) {
                    //make sure ALL accuracies of the given object are purged
                    delete this._collection[id];
                    deleted = true;
                }
            }
            return deleted;
        }


        public readonly static = derivedBase;
    }
}
