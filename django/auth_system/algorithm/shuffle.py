from math import floor


def fisher_yates_shuffle(the_list, SEED):
    list_length = len(the_list)
    PRNG = MT19937(SEED)
    for i in reversed(range(1, list_length)):
        j = floor(PRNG.rnd()*(i+1))
        the_list[i],  the_list[j] = the_list[j], the_list[i]
    return the_list


def _int32(x):
    return int(0xFFFFFFFF & x)


class MT19937:
    def __init__(self, seed):
        self.mt = [0] * 624
        self.mt[0] = seed
        self.mti = 0
        self.MAX_INT = 4294967296.0
        for i in range(1, 624):
            self.mt[i] = _int32(
                1812433253 * (self.mt[i - 1] ^ self.mt[i - 1] >> 30) + i)

    def extract_number(self):
        if self.mti == 0:
            self.twist()
        y = self.mt[self.mti]
        y = y ^ y >> 11
        y = y ^ y << 7 & 2636928640
        y = y ^ y << 15 & 4022730752
        y = y ^ y >> 18
        self.mti = (self.mti + 1) % 624
        return _int32(y)

    def twist(self):
        for i in range(0, 624):
            y = _int32((self.mt[i] & 0x80000000) +
                       (self.mt[(i + 1) % 624] & 0x7fffffff))
            self.mt[i] = (y >> 1) ^ self.mt[(i + 397) % 624]

            if y % 2 != 0:
                self.mt[i] = self.mt[i] ^ 0x9908b0df

    def rnd(self):
        return float(self.extract_number()) * (1.0 / self.MAX_INT)
