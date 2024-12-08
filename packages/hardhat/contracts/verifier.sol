// SPDX-License-Identifier: GPL-3.0
/*
    Copyright 2021 0KIMS association.

    This file is generated with [snarkJS](https://github.com/iden3/snarkjs).

    snarkJS is a free software: you can redistribute it and/or modify it
    under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    snarkJS is distributed in the hope that it will be useful, but WITHOUT
    ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
    License for more details.

    You should have received a copy of the GNU General Public License
    along with snarkJS. If not, see <https://www.gnu.org/licenses/>.
*/

pragma solidity >=0.7.0 <0.9.0;

contract Groth16Verifier {
    // Scalar field size
    uint256 constant r    = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    // Base field size
    uint256 constant q   = 21888242871839275222246405745257275088696311157297823662689037894645226208583;

    // Verification Key data
    uint256 constant alphax  = 18983281918900514147254622589383375484704569201273645262308422868944747716686;
    uint256 constant alphay  = 16124004499005060235484011168120968387100041081102554261385902394135160328975;
    uint256 constant betax1  = 16815741085870792182916123315649260783760345154816580420228811832709349025788;
    uint256 constant betax2  = 5985117141616789614049555186197575668327424068800353644921425104372000433583;
    uint256 constant betay1  = 15203522573684456471381261853696907916211981391198635328908516552409957238532;
    uint256 constant betay2  = 18936712982475247680190439389807771726933615185309216186803467025183300689621;
    uint256 constant gammax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant gammax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant gammay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant gammay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;
    uint256 constant deltax1 = 11559732032986387107991004021392285783925812861821192530917403151452391805634;
    uint256 constant deltax2 = 10857046999023057135944570762232829481370756359578518086990519993285655852781;
    uint256 constant deltay1 = 4082367875863433681332203403145435568316851327593401208105741076214120093531;
    uint256 constant deltay2 = 8495653923123431417604973247489272438418190587263600148770280649306958101930;

    
    uint256 constant IC0x = 21755117434101167230468908702288058863643265303755791501786960174731098709419;
    uint256 constant IC0y = 4571741093302053710101258939039201556732377845479049605618106833291834525322;
    
    uint256 constant IC1x = 17477084335974774646033746609946436699141217074680223908106681358223487244622;
    uint256 constant IC1y = 8380030942621511427056159367098482945171919978119591110424554870195829807993;
    
    uint256 constant IC2x = 12830346625244957233064147395023789814097224360457691130128010031872132998566;
    uint256 constant IC2y = 3012125588726221006966209784768800339103816650108462185410499346554956821174;
    
    uint256 constant IC3x = 6269393427964264641799970096054951090229500255796210009435750654319772000870;
    uint256 constant IC3y = 12638743764051737477332201582735031251402383305746365519596628597565450636090;
    
    uint256 constant IC4x = 21200416518744285758784165953288208809130693430022731172965561031417766257082;
    uint256 constant IC4y = 5046371107320384819551692398606883687810384573512548853251508077953529152639;
    
    uint256 constant IC5x = 9925817451304726948516361943549455662135955511714117642981558556016782561992;
    uint256 constant IC5y = 3096933360965396361502321943606907153377515531178346378213295249389616288166;
    
    uint256 constant IC6x = 9695977819962702799672193806471104188004234433740562866166194395928438756011;
    uint256 constant IC6y = 2133600480134977144794518286934353558782626676255388500085188799541026552980;
    
    uint256 constant IC7x = 11618768865228273082363980586343323083497228378767687509591350711272132811604;
    uint256 constant IC7y = 12713396935808714349284876751624209190343526892138737725247488655824419691013;
    
    uint256 constant IC8x = 13949741884723667446575794386367864296194991195943701992248022334961307710918;
    uint256 constant IC8y = 992859203101075615291770890048321955439951082281528755670151472215869991553;
    
    uint256 constant IC9x = 20088288686834972948280862004577841623661576059751561757798278446813869339553;
    uint256 constant IC9y = 2201070660675676089511839444034928462067671080245790905272986806410394519004;
    
    uint256 constant IC10x = 20144309552062185975884556930042544531585860618123581395188572870276397648556;
    uint256 constant IC10y = 20563932125994470474122195761949462080385414472609353874034384412034626075052;
    
    uint256 constant IC11x = 11248459924981887860000647409235837902504387779758405341767782948908043950785;
    uint256 constant IC11y = 3523831670939126644773288274663249166823672682823073814773216357737749157240;
    
    uint256 constant IC12x = 14790991456037061977621514630474300883952772671259913171616031929448236916933;
    uint256 constant IC12y = 8924973090836974514094115844455684038753247045399045716273502586963241557107;
    
    uint256 constant IC13x = 5089778011126683696836918187501684152653983284555640390379662337773386694799;
    uint256 constant IC13y = 16949472538607059078577089477859320312125285863276867809649370820020768934544;
    
    uint256 constant IC14x = 352280657663608032100913461494214207499477025055899609664697709673062289191;
    uint256 constant IC14y = 13126486903359231866635602059505573021537251187450968461969355772326822291461;
    
    uint256 constant IC15x = 6950913872937371191994057365185679998608437073055563515668186620799584715279;
    uint256 constant IC15y = 15112515615747281800573212501186581849071158402422360392876564147836358470870;
    
    uint256 constant IC16x = 7018898417059759557855657794399912699246756748092492239919382210790545123576;
    uint256 constant IC16y = 4475962035736911851225985479179884984275421518897937238286696318363206587740;
    
    uint256 constant IC17x = 18853039889157668913874518446309023369061596314963881052162971117586927822469;
    uint256 constant IC17y = 21868657454984599682435098250118414892593703500265257861822444546133200368342;
    
    uint256 constant IC18x = 7059183972016969160771313020769155898836161017136351913796405725558921668716;
    uint256 constant IC18y = 12759732246359507087508061914106465275042273175550858328070001349009220603744;
    
    uint256 constant IC19x = 3287307499802190876887327008292263805148707058339651129272193549688677696768;
    uint256 constant IC19y = 5097904371412961223380575462656347197819928550793092455543848539419639563793;
    
    uint256 constant IC20x = 13521437015718709750491641748672584541251550682556864094644386071305898133181;
    uint256 constant IC20y = 10122494311533571919056188419089990165943443913916679850827772917641184516885;
    
    uint256 constant IC21x = 19658635166727340945653805357382664609727641633172274291290318991948661405166;
    uint256 constant IC21y = 3839402136224373600474245390656399494787335427703460239110781528283529011873;
    
    uint256 constant IC22x = 7401802718040662914829504306753665973735751295914630358245161717700785532600;
    uint256 constant IC22y = 14629998123651994266649409556264074820471017163478347073473414122944488555886;
    
    uint256 constant IC23x = 13691801605710426518125015122799909253083451096144843197745231308859561513345;
    uint256 constant IC23y = 1362787447838939769649073943390293460090500305824556781756529683235304514727;
    
    uint256 constant IC24x = 7290048025056428910903540828853390238010202905336512258033389162129797863054;
    uint256 constant IC24y = 7452947267091852594777989537090017840784597462287852717299499700176999113655;
    
    uint256 constant IC25x = 17954965538531965380913871435872131035135560484735265750455856057739327081287;
    uint256 constant IC25y = 1653419847626963356628105931100769044230402142635188644766710235887189538523;
    
    uint256 constant IC26x = 2705930039557239676224787766596836906478233426741002433388441885931091225731;
    uint256 constant IC26y = 15070458101065286305002409409393765002650769160314339911157796705247194852577;
    
    uint256 constant IC27x = 4922658098328670550139669198584027972053517078372204023851291717528695075622;
    uint256 constant IC27y = 16032022264468027299389784173886549707487743497555799338884723255346247409835;
    
    uint256 constant IC28x = 15497994551492339750807650042559684509133075065509885594720118088339118408088;
    uint256 constant IC28y = 9707950620117959678739247400145347529528815178261976557028593964724042736149;
    
    uint256 constant IC29x = 19623333510287289280896120528942495686961204632264642004840261191208122478481;
    uint256 constant IC29y = 14810770025005197209528989939575332031843071945769807484594878264082201482491;
    
    uint256 constant IC30x = 225697156881543740908491614299646450962938331500718351046270925353877361704;
    uint256 constant IC30y = 5812905316592737685414906668301776999423263638583182380732080509932119537421;
    
    uint256 constant IC31x = 16422952361070845703160914259320333263868312245837157746550381509428547741442;
    uint256 constant IC31y = 13004632812601670954508424985529079147346214109841242398474808559625830524762;
    
    uint256 constant IC32x = 11059034027557522737693225952820511160720646788359289351092580322365447884187;
    uint256 constant IC32y = 2016022232834896101365460926890950957114972012572355680898078517776704569181;
    
    uint256 constant IC33x = 2399449837497592864974142749043443476387129109658536981583133963955350920854;
    uint256 constant IC33y = 1264545416743795876012790303454516917226800924171461842415909833323482533183;
    
    uint256 constant IC34x = 17189554545050185400865014626316128341188186336814912648053068092442354857084;
    uint256 constant IC34y = 3427338997195750597703270364644102327518141363552486479393634512820319398072;
    
    uint256 constant IC35x = 5967533276456279265849250371624245107689727007493523168560742246448907783732;
    uint256 constant IC35y = 3133640938922811402793110285096405576297161462835342170118725548463262953119;
    
    uint256 constant IC36x = 20814182199070066580604108463708728566618640877772312513421262247618589432023;
    uint256 constant IC36y = 6173512954599340399354180227771850378084459285824475245832630996244773417635;
    
    uint256 constant IC37x = 3972886927317245130777641739541695142624426323132053683783734459473712025541;
    uint256 constant IC37y = 8631540806422034688653792924445908136731504225426283867122093256684175290383;
    
    uint256 constant IC38x = 10933799462837702920376346854597366693955534882455243586465424714509610440937;
    uint256 constant IC38y = 17214382847543207196947883446228462876829890569710608512421697256569649714108;
    
    uint256 constant IC39x = 12747087511728050930915662462024466281456946794299754272984251050577712458723;
    uint256 constant IC39y = 11096093583276582014842576228967780957116349084115588606800273399186525737053;
    
    uint256 constant IC40x = 4056264078101473631219755304447587872247811902554071550541631087010248141482;
    uint256 constant IC40y = 11985657256065044272314450614691914913244572938401847147269155733127970886431;
    
    uint256 constant IC41x = 2608992356360489126848524563658288448197706699385352670006904321301337107803;
    uint256 constant IC41y = 9442647286934715719976155007795580000089707176420538336785747223747347214895;
    
    uint256 constant IC42x = 9009178697412479262324375216789430418343187982717721835285073685492036536063;
    uint256 constant IC42y = 1003782034363512036483366803932587172430966274307669671588298041671449833147;
    
    uint256 constant IC43x = 5204950834450268225964844982215284152011034987110895158451009798902694680386;
    uint256 constant IC43y = 20510217091027762011356088999391221355175369170404042717300620260012193030176;
    
    uint256 constant IC44x = 20317029160965196065854051017890751165302776351229264072383217808037426822730;
    uint256 constant IC44y = 21003022346993805102102683308616055485749987903478067022275244672399607454786;
    
    uint256 constant IC45x = 19026245065568119712240456970368546625400096931836468930492074610580208406747;
    uint256 constant IC45y = 19643554525406973264081702182287460263386112544482107744237284970354458495922;
    
    uint256 constant IC46x = 7675352399809025604952710871594827184604500479931227542905874761809073778248;
    uint256 constant IC46y = 13654407129873939067325575807492436791915375624670330134087504744671007509317;
    
    uint256 constant IC47x = 13819286550413938326434768160592396801198371632187308286979001602855413243588;
    uint256 constant IC47y = 8729938498276321339125059276474653525246002474991305846596503325838186013101;
    
    uint256 constant IC48x = 8968048838436197229705497547157436228149415896051794343661887159920987225882;
    uint256 constant IC48y = 5935775625634931591952748523715087801548666308765014949705951668500172407931;
    
 
    // Memory data
    uint16 constant pVk = 0;
    uint16 constant pPairing = 128;

    uint16 constant pLastMem = 896;

    function verifyProof(uint[2] calldata _pA, uint[2][2] calldata _pB, uint[2] calldata _pC, uint[48] calldata _pubSignals) public view returns (bool) {
        assembly {
            function checkField(v) {
                if iszero(lt(v, r)) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }
            
            // G1 function to multiply a G1 value(x,y) to value in an address
            function g1_mulAccC(pR, x, y, s) {
                let success
                let mIn := mload(0x40)
                mstore(mIn, x)
                mstore(add(mIn, 32), y)
                mstore(add(mIn, 64), s)

                success := staticcall(sub(gas(), 2000), 7, mIn, 96, mIn, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }

                mstore(add(mIn, 64), mload(pR))
                mstore(add(mIn, 96), mload(add(pR, 32)))

                success := staticcall(sub(gas(), 2000), 6, mIn, 128, pR, 64)

                if iszero(success) {
                    mstore(0, 0)
                    return(0, 0x20)
                }
            }

            function checkPairing(pA, pB, pC, pubSignals, pMem) -> isOk {
                let _pPairing := add(pMem, pPairing)
                let _pVk := add(pMem, pVk)

                mstore(_pVk, IC0x)
                mstore(add(_pVk, 32), IC0y)

                // Compute the linear combination vk_x
                
                g1_mulAccC(_pVk, IC1x, IC1y, calldataload(add(pubSignals, 0)))
                
                g1_mulAccC(_pVk, IC2x, IC2y, calldataload(add(pubSignals, 32)))
                
                g1_mulAccC(_pVk, IC3x, IC3y, calldataload(add(pubSignals, 64)))
                
                g1_mulAccC(_pVk, IC4x, IC4y, calldataload(add(pubSignals, 96)))
                
                g1_mulAccC(_pVk, IC5x, IC5y, calldataload(add(pubSignals, 128)))
                
                g1_mulAccC(_pVk, IC6x, IC6y, calldataload(add(pubSignals, 160)))
                
                g1_mulAccC(_pVk, IC7x, IC7y, calldataload(add(pubSignals, 192)))
                
                g1_mulAccC(_pVk, IC8x, IC8y, calldataload(add(pubSignals, 224)))
                
                g1_mulAccC(_pVk, IC9x, IC9y, calldataload(add(pubSignals, 256)))
                
                g1_mulAccC(_pVk, IC10x, IC10y, calldataload(add(pubSignals, 288)))
                
                g1_mulAccC(_pVk, IC11x, IC11y, calldataload(add(pubSignals, 320)))
                
                g1_mulAccC(_pVk, IC12x, IC12y, calldataload(add(pubSignals, 352)))
                
                g1_mulAccC(_pVk, IC13x, IC13y, calldataload(add(pubSignals, 384)))
                
                g1_mulAccC(_pVk, IC14x, IC14y, calldataload(add(pubSignals, 416)))
                
                g1_mulAccC(_pVk, IC15x, IC15y, calldataload(add(pubSignals, 448)))
                
                g1_mulAccC(_pVk, IC16x, IC16y, calldataload(add(pubSignals, 480)))
                
                g1_mulAccC(_pVk, IC17x, IC17y, calldataload(add(pubSignals, 512)))
                
                g1_mulAccC(_pVk, IC18x, IC18y, calldataload(add(pubSignals, 544)))
                
                g1_mulAccC(_pVk, IC19x, IC19y, calldataload(add(pubSignals, 576)))
                
                g1_mulAccC(_pVk, IC20x, IC20y, calldataload(add(pubSignals, 608)))
                
                g1_mulAccC(_pVk, IC21x, IC21y, calldataload(add(pubSignals, 640)))
                
                g1_mulAccC(_pVk, IC22x, IC22y, calldataload(add(pubSignals, 672)))
                
                g1_mulAccC(_pVk, IC23x, IC23y, calldataload(add(pubSignals, 704)))
                
                g1_mulAccC(_pVk, IC24x, IC24y, calldataload(add(pubSignals, 736)))
                
                g1_mulAccC(_pVk, IC25x, IC25y, calldataload(add(pubSignals, 768)))
                
                g1_mulAccC(_pVk, IC26x, IC26y, calldataload(add(pubSignals, 800)))
                
                g1_mulAccC(_pVk, IC27x, IC27y, calldataload(add(pubSignals, 832)))
                
                g1_mulAccC(_pVk, IC28x, IC28y, calldataload(add(pubSignals, 864)))
                
                g1_mulAccC(_pVk, IC29x, IC29y, calldataload(add(pubSignals, 896)))
                
                g1_mulAccC(_pVk, IC30x, IC30y, calldataload(add(pubSignals, 928)))
                
                g1_mulAccC(_pVk, IC31x, IC31y, calldataload(add(pubSignals, 960)))
                
                g1_mulAccC(_pVk, IC32x, IC32y, calldataload(add(pubSignals, 992)))
                
                g1_mulAccC(_pVk, IC33x, IC33y, calldataload(add(pubSignals, 1024)))
                
                g1_mulAccC(_pVk, IC34x, IC34y, calldataload(add(pubSignals, 1056)))
                
                g1_mulAccC(_pVk, IC35x, IC35y, calldataload(add(pubSignals, 1088)))
                
                g1_mulAccC(_pVk, IC36x, IC36y, calldataload(add(pubSignals, 1120)))
                
                g1_mulAccC(_pVk, IC37x, IC37y, calldataload(add(pubSignals, 1152)))
                
                g1_mulAccC(_pVk, IC38x, IC38y, calldataload(add(pubSignals, 1184)))
                
                g1_mulAccC(_pVk, IC39x, IC39y, calldataload(add(pubSignals, 1216)))
                
                g1_mulAccC(_pVk, IC40x, IC40y, calldataload(add(pubSignals, 1248)))
                
                g1_mulAccC(_pVk, IC41x, IC41y, calldataload(add(pubSignals, 1280)))
                
                g1_mulAccC(_pVk, IC42x, IC42y, calldataload(add(pubSignals, 1312)))
                
                g1_mulAccC(_pVk, IC43x, IC43y, calldataload(add(pubSignals, 1344)))
                
                g1_mulAccC(_pVk, IC44x, IC44y, calldataload(add(pubSignals, 1376)))
                
                g1_mulAccC(_pVk, IC45x, IC45y, calldataload(add(pubSignals, 1408)))
                
                g1_mulAccC(_pVk, IC46x, IC46y, calldataload(add(pubSignals, 1440)))
                
                g1_mulAccC(_pVk, IC47x, IC47y, calldataload(add(pubSignals, 1472)))
                
                g1_mulAccC(_pVk, IC48x, IC48y, calldataload(add(pubSignals, 1504)))
                

                // -A
                mstore(_pPairing, calldataload(pA))
                mstore(add(_pPairing, 32), mod(sub(q, calldataload(add(pA, 32))), q))

                // B
                mstore(add(_pPairing, 64), calldataload(pB))
                mstore(add(_pPairing, 96), calldataload(add(pB, 32)))
                mstore(add(_pPairing, 128), calldataload(add(pB, 64)))
                mstore(add(_pPairing, 160), calldataload(add(pB, 96)))

                // alpha1
                mstore(add(_pPairing, 192), alphax)
                mstore(add(_pPairing, 224), alphay)

                // beta2
                mstore(add(_pPairing, 256), betax1)
                mstore(add(_pPairing, 288), betax2)
                mstore(add(_pPairing, 320), betay1)
                mstore(add(_pPairing, 352), betay2)

                // vk_x
                mstore(add(_pPairing, 384), mload(add(pMem, pVk)))
                mstore(add(_pPairing, 416), mload(add(pMem, add(pVk, 32))))


                // gamma2
                mstore(add(_pPairing, 448), gammax1)
                mstore(add(_pPairing, 480), gammax2)
                mstore(add(_pPairing, 512), gammay1)
                mstore(add(_pPairing, 544), gammay2)

                // C
                mstore(add(_pPairing, 576), calldataload(pC))
                mstore(add(_pPairing, 608), calldataload(add(pC, 32)))

                // delta2
                mstore(add(_pPairing, 640), deltax1)
                mstore(add(_pPairing, 672), deltax2)
                mstore(add(_pPairing, 704), deltay1)
                mstore(add(_pPairing, 736), deltay2)


                let success := staticcall(sub(gas(), 2000), 8, _pPairing, 768, _pPairing, 0x20)

                isOk := and(success, mload(_pPairing))
            }

            let pMem := mload(0x40)
            mstore(0x40, add(pMem, pLastMem))

            // Validate that all evaluations ∈ F
            
            checkField(calldataload(add(_pubSignals, 0)))
            
            checkField(calldataload(add(_pubSignals, 32)))
            
            checkField(calldataload(add(_pubSignals, 64)))
            
            checkField(calldataload(add(_pubSignals, 96)))
            
            checkField(calldataload(add(_pubSignals, 128)))
            
            checkField(calldataload(add(_pubSignals, 160)))
            
            checkField(calldataload(add(_pubSignals, 192)))
            
            checkField(calldataload(add(_pubSignals, 224)))
            
            checkField(calldataload(add(_pubSignals, 256)))
            
            checkField(calldataload(add(_pubSignals, 288)))
            
            checkField(calldataload(add(_pubSignals, 320)))
            
            checkField(calldataload(add(_pubSignals, 352)))
            
            checkField(calldataload(add(_pubSignals, 384)))
            
            checkField(calldataload(add(_pubSignals, 416)))
            
            checkField(calldataload(add(_pubSignals, 448)))
            
            checkField(calldataload(add(_pubSignals, 480)))
            
            checkField(calldataload(add(_pubSignals, 512)))
            
            checkField(calldataload(add(_pubSignals, 544)))
            
            checkField(calldataload(add(_pubSignals, 576)))
            
            checkField(calldataload(add(_pubSignals, 608)))
            
            checkField(calldataload(add(_pubSignals, 640)))
            
            checkField(calldataload(add(_pubSignals, 672)))
            
            checkField(calldataload(add(_pubSignals, 704)))
            
            checkField(calldataload(add(_pubSignals, 736)))
            
            checkField(calldataload(add(_pubSignals, 768)))
            
            checkField(calldataload(add(_pubSignals, 800)))
            
            checkField(calldataload(add(_pubSignals, 832)))
            
            checkField(calldataload(add(_pubSignals, 864)))
            
            checkField(calldataload(add(_pubSignals, 896)))
            
            checkField(calldataload(add(_pubSignals, 928)))
            
            checkField(calldataload(add(_pubSignals, 960)))
            
            checkField(calldataload(add(_pubSignals, 992)))
            
            checkField(calldataload(add(_pubSignals, 1024)))
            
            checkField(calldataload(add(_pubSignals, 1056)))
            
            checkField(calldataload(add(_pubSignals, 1088)))
            
            checkField(calldataload(add(_pubSignals, 1120)))
            
            checkField(calldataload(add(_pubSignals, 1152)))
            
            checkField(calldataload(add(_pubSignals, 1184)))
            
            checkField(calldataload(add(_pubSignals, 1216)))
            
            checkField(calldataload(add(_pubSignals, 1248)))
            
            checkField(calldataload(add(_pubSignals, 1280)))
            
            checkField(calldataload(add(_pubSignals, 1312)))
            
            checkField(calldataload(add(_pubSignals, 1344)))
            
            checkField(calldataload(add(_pubSignals, 1376)))
            
            checkField(calldataload(add(_pubSignals, 1408)))
            
            checkField(calldataload(add(_pubSignals, 1440)))
            
            checkField(calldataload(add(_pubSignals, 1472)))
            
            checkField(calldataload(add(_pubSignals, 1504)))
            

            // Validate all evaluations
            let isValid := checkPairing(_pA, _pB, _pC, _pubSignals, pMem)

            mstore(0, isValid)
             return(0, 0x20)
         }
     }
 }
