import React from 'react';

// Um einerseits die Verwendung der Properties in der Funktion zu
// vereinfachen und andererseits schon in der Signatur explizit auszudrücken,
// welche Properties die Komponente erwartet, schreiben wir als Methodenparameter
// nicht props, sondern verwenden das seit ES6 mögliche Objekt-Destructuring.
export default function ChoiceBar({title, count, percent, onClickHandler}) {
    return (
        <div
            className="ChoiceBar"
            onClick={onClickHandler}
        >
            <div className="Progress" style={{'width': percent + '%'}}>
                <div className="ChoiceBarTitle">{title}</div>
            </div>
            <div className="ChoiceBarBadge">{count}</div>
        </div>
    );
}

ChoiceBar.propTypes = {
    title: React.PropTypes.string.isRequired,
    count: React.PropTypes.number.isRequired,
    percent: React.PropTypes.number.isRequired,
    onClickHandler: React.PropTypes.func.isRequired
}
