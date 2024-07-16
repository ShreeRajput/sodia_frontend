import React from 'react'
import './message.css'
import { formatDistanceToNow } from 'date-fns';

export default function Message({msg,own}) {
  
  return (
    <div className={ own ? "message own" : "message" }>

        <div className="messageTop">
            <img
                className="messageImg"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOkAAACUCAMAAABBVf7OAAAAOVBMVEXR1dr////O1NjO0tjd4OP8/Pza3OD///3S09n19fbv8fLm6Ors7e/Lz9XV19v5+frU297k4+ji4+PLMcoSAAAEdklEQVR4nO2d65KDIAyFuXgBQWz7/g+76rZbd2rbEFQ8rd/vzpQzgSSEgEIcHBwcHBwcHOwcrUWbewyrYowIIlTO+cZ6f6lOuQe0EkpUhWs6eaf0Re5BLY8xJ+ftIK+u64lWl3tgS6PDr8wHaq9yj21Bens25azOgeaDfFPwT2X2RpVO5x7gUly6F0J7qWVlcg9xEYx/PnGv+DHAotM273T2Dtha66sWW6xupjHl+Qzuf2Sr3INNQTmCzD+QXVPxdo1ODSs9qmsy4bXXfdSKKtW8iqPzVgVNDqtIoQOQ25t2PtN9bVSLOH8Dw6RSFnhSVewq/aXDS/hPkY73BtxKVZeYWDrBoxlVExLeWTq0rXmI97xXpSH30COJSgSnlGBVtLjc/p/Sc+6xR8JWCrel4Tqk3vliKWU7JDilVUepNcwrxQozFdf1StmAKWULlU3uscdRHEoPpV+pFMsjJSgFi6ffozQhyqAp5WcODmud8rNBtNaHBKVo+1P2rg3uiJxX7R2VYnkkfs0BrWLWnrlKbQvle4NlVvD72dtAFQdLyS459ABJTciQBoByfH4JdKSEUWoSlcpD6f5ghxg0pTphdzqAs06ZLQ5/AB2h6qRwKm3u8dNpyySlPvf46bCP/n+54MxeleaSoPpfU4RaqH0beysjoZapSKr3liecZTqQcCaOJVRX3PkLdgA1SOVZ1QWwgtlwx4sjFajcMOEcnxNauE7QkRCvtIEKpXfiT6EcWP3+iorPfs+YSuMLZx3aScWN6GIoVsY7Ibp5EOw4/E7sJaiyQFWqIxu3u9wDTiBu+sJdq7gTaVRcoWNBiZ4nnVFX6Yiib94a0Kzhiq4k6ab4kDXkHmsi1JOLssAqNcygzpQyN24onaDPBKXAAeaOpvQQNh9gUqEoQdV+htL3QpEOEp+jKdvUL1L6CbNXU/ZuaN2Cs5AOU0v0DGnAkJRilrT/Q6qxfESORKsmod0knoN26gZbLLtjaHWHD0gHiU2E1mBvxAW5FAq/ERfiRKsPfsBOnNrbgXqg+Ae53awGn74t/bzNYk/fE1ko1EWDR4qIptBaegEbVF3cCVTdQJ4Um5bx9kpZtHgJRPDU6v3EqHW/JccyqwkFuxvUVziJoQ6O3yA5PpOPYVcjknQOdB7gYrFS/Hn7z65i39HVmEV0juy530yLInXeTindTlPh3p5pl0cesS7s0LCqeP/yPUvrztZrG158miKJblevk6iXn6ZI1lqovYitfNI1tvfYag+7HC3cYoHlOTtIm/SigeU5pc+a+hu9miN6pHMZM3/j067URlH3yzWTWccMdzulw1+5HKVSE9bIFN5hC7H1FDbM21xp1H0yvPFq1dxH4NNp1JarNfozI0uyafdHTqFbfkgp+V2VZKkbWVVfMguVG32cxZhszuiO26JLVuUILw9sMH/5Xy9YlPXfZjFh6WIRj3L10qFJfeVpKda/dLIPk27Qacj96NHyrPz67Q5i6Y2V0wdSW/JGrJoT7iJruLHqp91M4ltsixL1vckfx7U29BVlmEYAAAAASUVORK5CYII="
                alt="profile_picture"
            />
            <p className="messageText">{msg.text}</p>
        </div>

        <div className="messageBottom">{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</div>

  </div>
  )
}
