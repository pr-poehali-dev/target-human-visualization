import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface HitZone {
  id: string;
  name: string;
  hitChance: number;
  x: number;
  y: number;
  width: number;
  height: number;
  isHit: boolean;
}

const Index = () => {
  const [shots, setShots] = useState(5);
  const [shotsRemaining, setShotsRemaining] = useState(5);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [flashingZone, setFlashingZone] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const [zones, setZones] = useState<HitZone[]>([
    { id: 'head', name: 'ГОЛОВА', hitChance: 5, x: 50, y: 10, width: 20, height: 15, isHit: false },
    { id: 'body', name: 'ТЕЛО', hitChance: 10, x: 50, y: 30, width: 30, height: 35, isHit: false },
    { id: 'leftArm', name: 'Л.РУКА', hitChance: 15, x: 25, y: 35, width: 20, height: 25, isHit: false },
    { id: 'rightArm', name: 'П.РУКА', hitChance: 15, x: 85, y: 35, width: 20, height: 25, isHit: false },
    { id: 'leftLeg', name: 'Л.НОГА', hitChance: 15, x: 42, y: 70, width: 15, height: 28, isHit: false },
    { id: 'rightLeg', name: 'П.НОГА', hitChance: 15, x: 68, y: 70, width: 15, height: 28, isHit: false },
  ]);

  const handleShot = () => {
    if (shotsRemaining <= 0 || !isPlaying) return;

    const random = Math.random() * 100;
    let cumulativeChance = 0;
    let hitZone: HitZone | null = null;

    for (const zone of zones) {
      cumulativeChance += zone.hitChance;
      if (random <= cumulativeChance) {
        hitZone = zone;
        break;
      }
    }

    if (hitZone) {
      setHits(prev => prev + 1);
      setFlashingZone(hitZone.id);
      setZones(prevZones => 
        prevZones.map(z => z.id === hitZone.id ? { ...z, isHit: true } : z)
      );
      setTimeout(() => setFlashingZone(null), 400);
    } else {
      setMisses(prev => prev + 1);
    }

    const newShotsRemaining = shotsRemaining - 1;
    setShotsRemaining(newShotsRemaining);

    if (newShotsRemaining === 0) {
      setGameOver(true);
      setIsPlaying(false);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setShotsRemaining(shots);
    setHits(0);
    setMisses(0);
    setGameOver(false);
    setZones(zones.map(z => ({ ...z, isHit: false })));
  };

  const resetGame = () => {
    setIsPlaying(false);
    setShotsRemaining(shots);
    setHits(0);
    setMisses(0);
    setGameOver(false);
    setZones(zones.map(z => ({ ...z, isHit: false })));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-pixel">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-4xl text-primary mb-2 animate-pulse-neon" style={{ textShadow: '0 0 10px currentColor' }}>
            ARCADE SHOOTER
          </h1>
          <div className="text-xs md:text-sm text-secondary">
            INSERT COIN TO PLAY
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card border-4 border-primary" style={{ boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)' }}>
            <div className="mb-6">
              <h2 className="text-lg text-accent mb-4">НАСТРОЙКИ</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-foreground block mb-2">
                    ВЫСТРЕЛОВ: {shots}
                  </label>
                  <Slider
                    value={[shots]}
                    onValueChange={(val) => !isPlaying && setShots(val[0])}
                    min={1}
                    max={10}
                    step={1}
                    disabled={isPlaying}
                    className="my-4"
                  />
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>ГОЛОВА:</span>
                    <span className="text-accent">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ТЕЛО:</span>
                    <span className="text-accent">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>КОНЕЧНОСТИ:</span>
                    <span className="text-accent">15% КАЖДАЯ</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div className="bg-input p-3 border-2 border-border">
                  <div className="text-secondary">ОСТАЛОСЬ</div>
                  <div className="text-xl text-foreground mt-1">{shotsRemaining}</div>
                </div>
                <div className="bg-input p-3 border-2 border-secondary">
                  <div className="text-secondary">ПОПАЛ</div>
                  <div className="text-xl text-secondary mt-1">{hits}</div>
                </div>
                <div className="bg-input p-3 border-2 border-destructive">
                  <div className="text-destructive">МИМО</div>
                  <div className="text-xl text-destructive mt-1">{misses}</div>
                </div>
              </div>

              {!isPlaying && !gameOver && (
                <Button 
                  onClick={startGame}
                  className="w-full text-sm py-6 bg-secondary hover:bg-secondary/80 text-secondary-foreground border-4 border-secondary"
                  style={{ boxShadow: '0 0 15px rgba(0, 255, 153, 0.5)' }}
                >
                  <Icon name="Play" className="mr-2" size={16} />
                  START GAME
                </Button>
              )}

              {isPlaying && (
                <Button 
                  onClick={handleShot}
                  className="w-full text-sm py-6 bg-destructive hover:bg-destructive/80 text-destructive-foreground border-4 border-destructive animate-pulse-neon"
                  style={{ boxShadow: '0 0 15px rgba(255, 0, 85, 0.7)' }}
                >
                  <Icon name="Target" className="mr-2" size={16} />
                  FIRE! ({shotsRemaining})
                </Button>
              )}

              {gameOver && (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-input border-2 border-accent">
                    <div className="text-accent text-lg mb-2">GAME OVER!</div>
                    <div className="text-xs text-foreground">
                      ТОЧНОСТЬ: {((hits / shots) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <Button 
                    onClick={resetGame}
                    className="w-full text-sm py-6 bg-accent hover:bg-accent/80 text-accent-foreground border-4 border-accent"
                    style={{ boxShadow: '0 0 15px rgba(255, 170, 0, 0.5)' }}
                  >
                    <Icon name="RotateCcw" className="mr-2" size={16} />
                    ИГРАТЬ ЕЩЁ
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 bg-card border-4 border-primary relative overflow-hidden" style={{ boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)' }}>
            <h2 className="text-lg text-accent mb-4 text-center">МИШЕНЬ</h2>
            
            <div className="relative w-full aspect-square bg-input border-2 border-muted" style={{ boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)' }}>
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className={`absolute transition-all cursor-pointer ${
                    flashingZone === zone.id ? 'animate-hit' : ''
                  }`}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className={`w-full h-full border-4 flex items-center justify-center text-[8px] md:text-xs transition-all ${
                      zone.isHit
                        ? 'bg-secondary border-secondary text-secondary-foreground'
                        : 'bg-muted/20 border-primary text-primary hover:bg-primary/20'
                    }`}
                    style={{
                      boxShadow: zone.isHit 
                        ? '0 0 20px rgba(0, 255, 153, 0.8)' 
                        : flashingZone === zone.id 
                        ? '0 0 30px rgba(255, 0, 85, 1)'
                        : '0 0 10px rgba(255, 0, 85, 0.3)',
                    }}
                  >
                    {zone.isHit && '✓'}
                  </div>
                </div>
              ))}

              <div className="absolute bottom-2 right-2 text-[8px] text-muted-foreground">
                TARGET LOCKED
              </div>
            </div>

            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center text-accent text-sm animate-flash">
                PRESS START
              </div>
            )}
          </Card>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <div className="animate-pulse">© 1985 ARCADE CLASSICS</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
