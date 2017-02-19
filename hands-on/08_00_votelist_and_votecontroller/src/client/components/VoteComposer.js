import React, {Component} from 'react';

function emptyChoice () {
	return {
		id: `choice_${Date.now()}`,
		count: 0,
		title: null
	};
}

function emptyVote () {
	return {
		id: `vote_${Date.now()}`,
		title: '',
		description: '',
		formComplete: false,
		choices: [emptyChoice()]
	};
}

export default class VoteComposer extends Component {
	constructor(props) {
		super(props);

		this.state = {
			vote: emptyVote()
		};

		this.activateIfNeeded = this.activateIfNeeded.bind(this);
		this.save = this.save.bind(this);
		this.close = this.close.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	close() {
		const {onDeactivate} = this.props;
		this.setState(emptyVote());
		onDeactivate();
	}

	save() {
		const {onSave} = this.props;
		const {vote} = this.state;
		const newVote = {
			...vote,
			choices: vote.choices.slice(0, -1)
		};
		onSave(newVote);
		this.close();
	}

	activateIfNeeded() {
		const {onActivate, active} = this.props;
		if(!active) {
			onActivate();
		}
	}

	onChange(event) {
		// name und value-Property aus dem event den lokalen Variablen
		// fieldName bzw. fieldValue ausweisen
		const {name: fieldName, value: fieldValue} = event.target;
		const {vote} = this.state;

		const newVote = {
			// Bestehendes Objekt kopieren
			...vote,
		// ES6 "computed property". Der Name des Propertys entspricht
		// dem Wert der in eckigen Klammern angegebenen Variablen
		// (in unserem Fall also dem Namen eines der beiden Eingabefelder)
			[fieldName]: fieldValue
		};

		this.setState({
			vote: newVote
		});
	}

	onChoiceChange(choiceIx, title) {
		const {vote} = this.state;
		const choices = vote.choices;
		const choice = choices[choiceIx];

		const newChoice = {
			...choice,
			title
		};

		const newChoices = choices.map((c) => (c.id === choice.id ? newChoice : c));

			// Neue Choice erzeugen, wenn in das letzte Eingabefeld
			// etwas eingegeben wurde, und das Feld noch leer war
			if (!choice.title && newChoice.title && choiceIx === (choices.length - 1)) {
				newChoices.push(emptyChoice());
			}

			this.setState({
				vote: {
					...vote,
					choices: newChoices
				}
			});

	}

	isFormCompleted() {
		const {active} = this.props;
		const {vote: {title, description, choices}} = this.state;
		const choicesCount = choices.length;

		// Titel und Beschreibung sind gesetzt, und es ist mehr
		// als eine Choice an dem Vote-Objekt gestzt
		let formCompleted = active && title && description && choicesCount > 1;

		if (formCompleted) {
			// Wenn alle (bis auf das letzte) Choice-Objekte befüllt sind,
			// ist die Form "vollständig"
			formCompleted = choices.every((c, ix) => ix === choicesCount - 1 || c.title);
		}

		return formCompleted;
	}

	renderInactiveForm() {
		return (
			<div className="Row VotesRow Spacer" onClick={this.activateIfNeeded}>
				<h1 className="Title">
					<span className="Emphasis">What do <b>you</b> want to know?</span>
					<div className="Badge">Add Voting</div>
				</h1>
				<p>Click here to leave your own question.</p>
			</div>
		);
	}

	renderActiveForm() {
		const {vote: {title, description, choices}} = this.state;
		const formCompleted = this.isFormCompleted();

		return (
			<div className="Row VoteComposer Spacer">
				<div className="Head">
					<h1 className="Title">
						<input
							className="Title"
							autoFocus
							type="text"
							placeholder="What do you want to know?"
							name="title"
							value={title}
							onChange={this.onChange}
						/>
					</h1>
					<input
						className="Description"
						name="description"
						placeholder="Describe your question in one sentence here"
						type="text"
						value={description}
						onChange={this.onChange}
					/>
				</div>
				<div className="Body">
					{choices.map((c, ix) => {
						const keyAndName = `choices_${ix}`;
						return (
							<input
								className="Choice"
								type="text"
								key={keyAndName}
								name={keyAndName}
								placeholder={`Choice #${(ix + 1)}`}
								onChange={(event) => {this.onChoiceChange(ix, event.target.value)}}
							/>
						);
					})}
					
					<div className="ButtonBar">
						<a
							className={formCompleted ? 'Button' : 'Button disabled'}
							onClick={this.save}
						>
							Save
						</a>
						<a
							className="Button"
							onClick={this.close}
						>
							Cancel
						</a>
					</div>
				</div>

			</div>
		);
	}

	render() {
		const {active} = this.props;

		if (!active) {
			return this.renderInactiveForm();
		}
		return this.renderActiveForm();
	}

}

VoteComposer.propTypes = {
	active: 			React.PropTypes.bool,
	onSave: 			React.PropTypes.func.isRequired,
	onActivate: 	React.PropTypes.func.isRequired,
	onDeactivate: React.PropTypes.func.isRequired
};
