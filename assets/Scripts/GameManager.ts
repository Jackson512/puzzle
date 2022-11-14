import { _decorator, Component, Node, resources, Sprite, SpriteFrame, Rect, find, Vec2, UITransform, instantiate, sp, Texture2D, EditBox, RichText, View, view, ToggleContainer } from 'cc';
import { Block } from './Block';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private img: Sprite;

    private prefab: Node;

    @property
    public size: number = 4;

    private item: Node;

    @property
    public w: number = 2;

    @property
    public h: number = 2;

    public static instance: GameManager;

    private blocks: Block[] = [];

    public _list: number[] = [];

    private xBox: EditBox;
    private yBox: EditBox;
    private idBox: EditBox;

    private winText: Node;

    private flag: boolean = false;

    start() {
        this.rebuild();
    }

    onLoad() {
        this.img = this.node.getComponent(Sprite);

        this.prefab = find("Canvas/prefab");
        this.item = find("Canvas/Item");

        this.xBox = find("Canvas/XBox").getComponent(EditBox);
        this.yBox = find("Canvas/YBox").getComponent(EditBox);
        this.idBox = find("Canvas/Id").getComponent(EditBox);
        GameManager.instance = this;

        this.winText = find("Canvas/Win");
    }

    rebuild() {
        for (let block of this.blocks) {
            block.node.destroy();
        }
        this.blocks = [];
        this._list = [];

        //获取选择的宽
        this.w = parseInt(this.xBox.string) ? parseInt(this.xBox.string) : 4;
        //获取选择的高
        this.h = parseInt(this.yBox.string) ? parseInt(this.yBox.string) : 4;
        //选择图片
        let id = parseInt(this.idBox.string) ? parseInt(this.idBox.string) : 1;
        if (id < 1 || id > 3) {
            id = 1;
        }

        resources.load("imgs/"+ id + "/texture", Texture2D, (err, texture) => {
            let sp = new SpriteFrame();
            sp.texture = texture;
            this.img.spriteFrame = sp;

            this.onLoadEnd(texture);
        });

        this.winText.active = false;
    }

    //打乱
    Upset() {
        for (let i = 0; i < this._list.length; i++) {
            let rIndex = Math.random() * this._list.length;
            rIndex = Math.floor(rIndex);
            let index = this._list[rIndex];

            this.changeBlock(this.blocks[i], this.blocks[index]);
        }
        //console.log(this._list);
    }

    check() : boolean {
        if (this.flag) return;
        let num = 0;
        for (let i of this._list) {
            if (i != num) {
                return false;
            }
            num++;
        }
        return true;
    }

    getTotalSize() : number{
        return this.w * this.h;
    }


    changeBlock(block1: Block, block2: Block) {

        this._list[block1.getNum()] = block2.id;
        this._list[block2.getNum()] = block1.id;
        //交换位置
        const block1Pos = block1.getStartPos();
        const block1Num = block1.getNum();

        //console.log(block1Pos);
        //console.log(block2.getStartPos());
        block1.setPos(block2.getStartPos());
        block1.setNum(block2.getNum());
        block2.setPos(block1Pos);
        block2.setNum(block1Num);

        //检测是否成功
        if (this.check()) {
            this.gameWin();
        }
    }

    gameWin() {
        this.winText.active = true;
        //console.log("太棒啦，你赢了");
    }

    getLateBlock(block: Block) : Block {
        let list = this.blocks.filter(b => b != block);
        list = list.sort((a, b) => Vec2.distance(block.getPos(), a.getPos()) - Vec2.distance(block.getPos(), b.getPos()));
        return list[0];
    }

    onLoadEnd(texture: Texture2D) {
        let tf = this.node.getComponent(UITransform);
        let weight = tf.width;
        let height = tf.height;
        tf.width = 0;
        tf.height = 0;

        let x = 0;
        let y = 0;
        weight /= this.w;
        height /= this.h;
        for (let i = 0; i < this.w * this.h; i++) {
            const block = instantiate(this.prefab).getComponent(Block);
            block.set(texture, x * weight, y * height, weight, height);
            block.node.setParent(this.item);
            block.setId(i);
            block.node.setPosition(x * weight, y * -height);
            block.setStartPos(block.node.getPosition());
            this._list.push(i);

            this.blocks.push(block);
            x++;
            if (x >= this.w) {
                y++;
                x = 0;
            }
        }

        this.flag = true;
        this.Upset();
        this.flag = false;

    }


}

