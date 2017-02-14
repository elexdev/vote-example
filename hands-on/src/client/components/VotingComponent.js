import React, { Component } from 'react';

import ChoiceBar from './ChoiceBar';

export default class VotingComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			vote: props.vote
		};
	}

	registerChoice(c) {
		const {vote} = this.state;
		const newVote = {
			// Properties aus dem Vote-Objekt kopieren
			...vote,
			// ein neues Choices-Array erzeugen, innerhalb des Choice-Arrays
			// die übergebene Choice (c) kopieren und den count erhöhen
			choices: vote.choices.map(choice =>
				choice.id !== c.id ? choice : {...choice, count: choice.count + 1}
			)
		};
		this.setState({vote: newVote});

		console.log(`Registering choice: ${c.id}`);
	}

	render() {
		const {vote} = this.state;
		const totalVotes = vote.choices.reduce((prev, curr) => prev + curr.count, 0);
		return (
			<div className="Row VotingRow Spacer">
				<div className="Head">
					<h1 className="Title">{vote.title}
						<div className="Badge">{totalVotes}</div>
					</h1>
					<div className="Description Emphasis">
						{vote.description}
					</div>
				</div>
				<div>
					{vote.choices.map(choice =>
						<ChoiceBar
							key={choice.id}
							onClickHandler={ () => this.registerChoice(choice)}
							percent={choice.count * (100 / totalVotes)}
							{...choice}
						/>
					)}
				</div>
			</div>
		);
	}
}

VotingComponent.propTypes = {
	vote: React.PropTypes.object.isRequired
};
