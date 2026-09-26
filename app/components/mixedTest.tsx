import {typefaces} from '../lib/constants'

export function mixedTest({text} : {text:string}) {
    return(
        <>
        {[...text].map((character, index) => 
        character === ' ' ? (
            <span key={index}>&nbsp;</span>
        ) : (
            <span key={index} style={{fontFamily:typefaces[index & typefaces.length]}}>
                {character}
            </span>
            ),
        )}
        </>
    )
}