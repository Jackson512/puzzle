import { _decorator, Component, Node, SpriteFrame, Vec2, Sprite, Rect, UITransform, Texture2D, Vec3, NodeEventType, Event, EventTouch} from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {

    private sprite: Sprite;

    private _drag: boolean = false;

    public flag: boolean = false;

    public id: number;

    private _startPos: Vec3;

    private num: number;

    setNum(num: number){
        this.num = num;
    }

    getNum() : number{
        return this.num;
    }

    onLoad() {
        this.sprite = this.node.getComponent(Sprite);

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    setId(id: number){
        this.num = id;
        this.id = id;
    }

    getId() : number{
        return this.id;
    }

    setPos(pos: Vec3) {
        this.node.setPosition(pos);
        this._startPos = pos;
    }

    getPos() : Vec3 {
        return this.node.getPosition();
    }

    setStartPos(pos: Vec3) {
        this._startPos = pos;
    }

    getStartPos() : Vec3 {
        return this._startPos;
    }

    set(pic: Texture2D, x: number, y: number, weight: number, height: number) {
        this.sprite = this.node.getComponent(Sprite);

        let spriteF = new SpriteFrame();
        spriteF.texture = pic;

        spriteF.rect = new Rect(x, y, weight, height);
        this.sprite.spriteFrame = spriteF;
    }

    onTouchStart(event: EventTouch) {
        let node = event.target;
        node.setSiblingIndex(GameManager.instance.getTotalSize());
        node.getComponent(Block)._startPos = node.getPosition();
    }

    onTouchMove(event: EventTouch) {
        let d = event.getDelta();
        let target = event.target;
        const selfX = target.getPosition().x;
        const selfY = target.getPosition().y;
        target.setPosition(selfX + d.x, selfY + d.y, -1);
    }

    onTouchEnd(event: EventTouch) {
        let b = GameManager.instance.getLateBlock(event.target.getComponent(Block));
        GameManager.instance.changeBlock(this, b);
    }

    set2(pic: Texture2D, x: number, y: number) {
        let spriteF = new SpriteFrame();
        spriteF.texture = pic;

        spriteF.rect = new Rect(x, y, 500, 500);
        this.sprite.spriteFrame = spriteF;

        console.log(pic);

    }


}

