export default function cardFunct(suit, num) {
  const spade = () => {
    return <>
      <div className="circle one"></div>
      <div className="circle two"></div>
      <div className="diag spade-left"></div>
      <div className="diag spade-right"></div>
      <div className="spade-block"></div>
      <div className="spade-stem"></div>
    </>
  }

  const hearts = () => {
    return <>
      <div className="heart-circle heart-one"></div>
      <div className="heart-circle heart-two"></div>
      <div className="heartDiag heartLeft"></div>
      <div className={`heartDiag heartRight`}></div>
      <div className="heart-block"></div>
    </>
  }

  const diamonds = () => {
    return <>
      <div className="rhombus"></div>
      <div className="out-take diamond-one"></div>
      <div className="out-take diamond-two"></div>
      <div className="out-take diamond-three"></div>
      <div className="out-take diamond-four"></div>
    </>
  }

  const clubs = () => {
    return <>
      <div className="club-circle club-one"></div>
      <div className="club-circle club-two"></div>
      <div className="club-circle club-three"></div>
      <div className="club-circle club-four"></div>
      <div className="clubStem"></div>
    </>
  }

  return <div className={`bg-gray-600 flex flex-col w-[80px] h-[120px] rounded-md border-[1px] border-white`}>
    <div className="relative left-1 text-sm  font-bold top-1">{num}</div>
    <div className={`absolute w-[80px] top-[20px] h-[80px]`}>
      {suit === "spades" ? <div className="absolute left-[17.5px] w-[100%] h-[100%] top-[30px]">{spade()}</div> : suit === "hearts" ? <div className="left-[17px] top-[21px] w-[100%] h-[100%] absolute">{hearts()}</div> : suit === "diamonds" ? <div className="absolute left-[10px] top-[15.5px] w-[100%] h-[100%]">{diamonds()}</div> : <div className="absolute left-[-1px] top-[15px] w-[100%] h-[100%]">{clubs()}</div>}
    </div>
  </div>
}