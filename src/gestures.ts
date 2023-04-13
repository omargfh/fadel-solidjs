// types
type Gesture = 'tap' | 'pinch' | 'pan'
interface TouchPoint {
    x: number
    y: number
}
interface TouchCollection {
    touches: TouchPoint[]
    length: number
}
interface AbstractGesture {
    touchCollections: TouchCollection[]
    length: number
}
interface RecognizedGesture {
    gesture: Gesture,
    touchCollections: TouchCollection[],
    length: number,
    direction: string,
    magnitude: number
}

// recognizers
const recognizeGesture = (gesture: AbstractGesture): RecognizedGesture => {
    if (gesture.length === 2) {
        const pinchPan: RecognizedGesture = recognizePinchPan(gesture)
        return pinchPan
    }
    return {
        gesture: 'tap',
        magnitude: 0,
        direction: 'none',
        ...gesture
    }
}

const recognizePinchPan = (gesture: AbstractGesture): RecognizedGesture => {
    let magnitude = 0 // raw pixels
    let direction = 0 // 0 = none, 1 = in, 2 = out (pinch) and 3 = left, 4 = right (pan)
    let numTouches = gesture.touchCollections.length
    let margin = 1.15

    // first touch
    let touch1f1 = gesture.touchCollections[numTouches - 1].touches[0]
    let touch1f2 = gesture.touchCollections[numTouches - 2].touches[0]

    // second touch
    let touch2f1 = gesture.touchCollections[numTouches - 1].touches[1]
    let touch2f2 = gesture.touchCollections[numTouches - 2].touches[1]

    // calculate distance between first and second touch using L1 norm
    let distance1 = Math.abs(touch1f1.x - touch1f2.x) + Math.abs(touch1f1.y - touch1f2.y)
    let distance2 = Math.abs(touch2f1.x - touch2f2.x) + Math.abs(touch2f1.y - touch2f2.y)

    // calculate magnitude
    magnitude = Math.abs(distance1 - distance2)

    // calculate direction
    direction = distance1 > distance2 * margin ? 1 : (distance1 * margin < distance2  ? 2 : 0)

    // calculate pan direction
    if (direction === 0) {
        let pan1 = Math.abs(touch1f1.x - touch1f2.x)
        let pan2 = Math.abs(touch2f1.x - touch2f2.x)
        direction = pan1 > pan2 ? 3 : 4
    }

    // return the recognized gesture
    return {
        gesture: direction < 3 ? 'pinch' : 'pan',
        touchCollections: gesture.touchCollections,
        length: gesture.length,
        direction: direction < 3 ? (direction === 1 ? 'in' : 'out') : (direction === 3 ? 'left' : 'right'),
        magnitude: magnitude
    }
}

export {
    recognizeGesture
}
export type {
    Gesture,
    TouchPoint,
    TouchCollection,
    AbstractGesture,
    RecognizedGesture
}

// console.log(recognizeGesture({
//     touchCollections: [{
//         touches: [{
//             x: 10,
//             y: 4
//         }, {
//             x: 11,
//             y: 3
//         }],
//         length: 2
//     },{
//         touches: [{
//             x: 11,
//             y: 4
//         }, {
//             x: 12,
//             y: 4
//         }],
//         length: 2
//     }],
//     length: 2
// }))