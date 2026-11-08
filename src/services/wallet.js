/* Wallet & Progress Module - TTW Retro Arcade
   Koin virtual, bonus harian, statistik, tersimpan di localStorage (F-07, F-08)
*/

const STORAGE_KEY = 'ttw_arcade_wallet';
const DEFAULT_BALANCE = 1000;
const DAILY_BONUS_AMOUNT = 500;
const BONUS_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 Jam

class Wallet {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          balance: typeof parsed.balance === 'number' ? parsed.balance : DEFAULT_BALANCE,
          totalPlayed: parsed.totalPlayed || 0,
          totalWon: parsed.totalWon || 0,
          highestBalance: parsed.highestBalance || DEFAULT_BALANCE,
          lastBonusTime: parsed.lastBonusTime || 0
        };
      }
    } catch {
      // Fallback bila data rusak
    }

    return {
      balance: DEFAULT_BALANCE,
      totalPlayed: 0,
      totalWon: 0,
      highestBalance: DEFAULT_BALANCE,
      lastBonusTime: 0
    };
  }

  saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      window.dispatchEvent(new CustomEvent('ttw-wallet-updated', { detail: this.data }));
    } catch {
      // Penyimpanan private browsing fallback
    }
  }

  getBalance() {
    return this.data.balance;
  }

  getStats() {
    return {
      totalPlayed: this.data.totalPlayed,
      totalWon: this.data.totalWon,
      highestBalance: this.data.highestBalance
    };
  }

  addCoins(amount, isWin = false) {
    if (amount <= 0) return;
    this.data.balance += amount;
    if (this.data.balance > this.data.highestBalance) {
      this.data.highestBalance = this.data.balance;
    }
    if (isWin) {
      this.data.totalWon += 1;
    }
    this.saveData();
  }

  deductCoins(amount) {
    if (amount <= 0) return false;
    if (this.data.balance < amount) return false;

    this.data.balance -= amount;
    this.data.totalPlayed += 1;
    this.saveData();
    return true;
  }

  resetBalance() {
    this.data.balance = DEFAULT_BALANCE;
    this.saveData();
    return DEFAULT_BALANCE;
  }

  canClaimDailyBonus() {
    const now = Date.now();
    return (now - this.data.lastBonusTime) >= BONUS_COOLDOWN_MS;
  }

  getRemainingDailyBonusTime() {
    const now = Date.now();
    const elapsed = now - this.data.lastBonusTime;
    if (elapsed >= BONUS_COOLDOWN_MS) return 0;
    return BONUS_COOLDOWN_MS - elapsed;
  }

  claimDailyBonus() {
    if (!this.canClaimDailyBonus()) {
      return { success: false, remaining: this.getRemainingDailyBonusTime() };
    }
    this.data.balance += DAILY_BONUS_AMOUNT;
    this.data.lastBonusTime = Date.now();
    if (this.data.balance > this.data.highestBalance) {
      this.data.highestBalance = this.data.balance;
    }
    this.saveData();
    return { success: true, amount: DAILY_BONUS_AMOUNT, newBalance: this.data.balance };
  }
}

export const wallet = new Wallet();
