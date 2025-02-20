import Main from './index';
import { equals } from 'typescript-is';
import utils from './utils';
import config from './config';
import type { RSS3IContent, RSS3Index, RSS3ItemInput, RSS3Item } from '../types/rss3';

class Item {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    private async getPosition(itemID: string) {
        // try index file first
        let fileID = this.main.account.address;
        let file = <RSS3IContent>await this.main.files.get(fileID);
        let index = file.items.findIndex((item) => item.id === itemID);
        if (index === -1) {
            const parsed = utils.id.parse(itemID);
            let fileID = this.main.account.address + '-items-' + Math.ceil(parsed.index / config.itemPageSize);
            file = <RSS3IContent>await this.main.files.get(fileID);
            index = file.items.findIndex((item) => item.id === itemID);
        }
        return {
            file,
            index,
        };
    }

    async get(itemID: string) {
        const position = await this.getPosition(itemID);
        if (position.index !== -1) {
            return position.file.items[position.index];
        } else {
            return null;
        }
    }

    async post(itemIn: RSS3ItemInput) {
        if (utils.check.valueLength(itemIn) && equals<RSS3ItemInput>(itemIn)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            if (!file.items) {
                file.items = [];
            }

            const id = file.items[0] ? utils.id.parse(file.items[0].id).index + 1 : 0;

            const nowDate = new Date().toISOString();
            const item: RSS3Item = Object.assign(
                {
                    authors: [this.main.account.address],
                    date_published: nowDate,
                },
                itemIn,
                {
                    id: `${this.main.account.address}-item-${id}`,
                    date_modified: nowDate,
                },
            );
            utils.object.removeEmpty(item);

            file.items.unshift(item);

            if (file.items.length > config.itemPageSize) {
                const newList = file.items.slice(1);
                const newID =
                    this.main.account.address +
                    '-items-' +
                    (file.items_next ? utils.id.parse(file.items_next).index + 1 : 0);
                const newFile = <RSS3IContent>this.main.files.new(newID);
                newFile.items = newList;
                newFile.items_next = file.items_next;
                this.main.files.set(newFile);

                file.items = file.items.slice(0, 1);
                file.items_next = newID;
            }

            this.main.files.set(file);

            return item;
        } else {
            throw Error('Parameter error');
        }
    }

    async patch(itemIn: RSS3ItemInput) {
        if (utils.check.valueLength(itemIn) && itemIn.id && equals<RSS3ItemInput>(itemIn)) {
            const position = await this.getPosition(itemIn.id);

            if (position.index !== -1) {
                const nowDate = new Date().toISOString();
                position.file.items[position.index] = Object.assign(position.file.items[position.index], itemIn, {
                    date_modified: nowDate,
                });
                utils.object.removeEmpty(position.file.items[position.index]);

                this.main.files.set(position.file);
                return position.file.items[position.index];
            } else {
                return null;
            }
        } else {
            throw Error('Parameter error');
        }
    }
}

export default Item;
