import {
	Role,
	Team,
	Teamship,
} from '@asmodee/werewolf-core';

import TeamItem from './TeamItem';

const roleList = Object.values(Role).filter((role) => !Number.isNaN(role)).map((role) => Number(role));

interface RoleSelection {
	role: Role;
	num: number;
}

export default class TeamSelector {
	protected readonly id: number;

	protected readonly team: TeamItem;

	protected readonly basic?: RoleSelection;

	protected readonly others: RoleSelection[];

	constructor(team: Team, basic?: Role) {
		this.id = team;
		this.team = new TeamItem(team);
		if (basic) {
			this.basic = {
				role: basic,
				num: 0,
			};
		}

		this.others = roleList.filter(
			(role) => Teamship.get(role) === this.team.id && (!this.basic || role !== basic),
		).map(
			(role) => ({
				role,
				num: 0,
			}),
		);
	}

	getOthers(): RoleSelection[] {
		return this.others;
	}

	update(items: IterableIterator<[Role, number]>): void {
		for (const [role, num] of items) {
			if (this.basic) {
				if (this.basic.role === role) {
					this.basic.num = num;
					continue;
				}
			}
			for (const other of this.others) {
				if (other.role === role) {
					other.num = num;
					continue;
				}
			}
		}
	}
}

export const selectors = [
	new TeamSelector(Team.Werewolf, Role.Werewolf),
	new TeamSelector(Team.Villager, Role.Villager),
	new TeamSelector(Team.Other),
];
