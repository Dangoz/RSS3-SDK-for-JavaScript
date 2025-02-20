import Main from './index';
import type { RSS3Index, RSS3Links } from '../types/rss3';
import utils from './utils';
import { equals } from 'typescript-is';

class Links {
    private main: Main;

    constructor(main: Main) {
        this.main = main;
    }

    async get(fileID: string = this.main.account.address, type?: string) {
        const linksList = (<RSS3Index>await this.main.files.get(fileID)).links || [];
        if (type) {
            return linksList.find((links) => links.type === type);
        } else {
            return linksList;
        }
    }

    async post(links: RSS3Links) {
        if (utils.check.valueLength(links) && equals<RSS3Links>(links)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            if (!file.links) {
                file.links = [];
            }
            if (!file.links.find((lks) => lks.type === links.type)) {
                links.list?.forEach((link) => {
                    this.main.files.clearCache(`${link}-backlink@${links.type}`);
                });
                utils.object.removeEmpty(links);
                file.links.push(links);
            } else {
                throw Error('Link type already exists');
            }
            this.main.files.set(file);
            return links;
        } else {
            throw Error('Parameter error');
        }
    }

    async delete(type: string) {
        const file = <RSS3Index>await this.main.files.get(this.main.account.address);
        const index = (file.links || []).findIndex((lks) => lks.type === type);
        if (index > -1) {
            const links = file.links[index];
            links.list?.forEach((link) => {
                this.main.files.clearCache(`${link}-backlink@${links.type}`);
            });
            file.links.splice(index, 1);
            if (file.links.length === 0) {
                delete file.links;
            }
            this.main.files.set(file);
            return links;
        } else {
            throw Error('Link type does not exist');
        }
    }

    async patch(links: RSS3Links) {
        if (utils.check.valueLength(links) && equals<RSS3Links>(links)) {
            const file = <RSS3Index>await this.main.files.get(this.main.account.address);
            const linksList = file.links;
            const index = (linksList || []).findIndex((lks) => lks.type === links.type);
            if (index > -1) {
                links.list?.forEach((link) => {
                    this.main.files.clearCache(`${link}-backlink@${links.type}`);
                });
                linksList[index] = Object.assign(linksList[index], links);
                utils.object.removeEmpty(links);
                this.main.files.set(file);
                return linksList[index];
            } else {
                throw Error('Link type does not exist');
            }
        }
    }
}

export default Links;
