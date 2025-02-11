// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NativeERC20Swap is Ownable {
    IERC20 public usdt;

    uint256 public rate;

    constructor(address _usdt, uint256 _initialRate) Ownable(msg.sender) {
        require(_usdt != address(0), "Invalid USDT address");
        require(_initialRate > 0, "Rate must be > 0");

        usdt = IERC20(_usdt);
        rate = _initialRate;
    }

    function swapNativeForUsdt() external payable {
        require(msg.value > 0, "Send KITE to swap");

        uint256 usdtAmount = (msg.value * rate) / 1e18;
        require(usdt.balanceOf(address(this)) >= usdtAmount, "Not enough USDT in contract");

        bool success = usdt.transfer(msg.sender, usdtAmount);
        require(success, "USDT transfer failed");
    }

    function swapUsdtForNative(uint256 _usdtAmount) external {
        require(_usdtAmount > 0, "Amount must be > 0");

        bool successA = usdt.transferFrom(msg.sender, address(this), _usdtAmount);
        require(successA, "USDT transferFrom failed");
    
        uint256 kiteAmount = (_usdtAmount * 1e18) / rate;
        require(address(this).balance >= kiteAmount, "Not enough KITE in contract");

        (bool successB, ) = payable(msg.sender).call{value: kiteAmount}("");
        require(successB, "Native token transfer failed");
    }

    function updateRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "Rate must be > 0");
        rate = newRate;
    }

    function withdrawUsdt(uint256 _amount) external onlyOwner {
        require(usdt.balanceOf(address(this)) >= _amount, "Insufficient USDT balance");
        bool success = usdt.transfer(owner(), _amount);
        require(success, "USDT withdrawal failed");
    }

    function withdrawNative(uint256 _amount) external onlyOwner {
        require(address(this).balance >= _amount, "Insufficient KITE balance");
        (bool success, ) = owner().call{value: _amount}("");
        require(success, "Native withdrawal failed");
    }

    function addUsdtLiquidity(uint256 _amount) external onlyOwner {
        require(_amount > 0, "Amount must be > 0");
        bool success = usdt.transferFrom(msg.sender, address(this), _amount);
        require(success, "USDT liquidity transfer failed");
    }

    receive() external payable {}
    fallback() external payable {}
}
