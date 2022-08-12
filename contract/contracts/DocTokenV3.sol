// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract DocTokenV3 is Initializable, ERC1155Upgradeable, OwnableUpgradeable, ERC1155SupplyUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC1155_init("");
        __Ownable_init();
        __ERC1155Supply_init();
        
    }
    
    using SafeMath for uint256;
    uint public mintFee;
    address public  cashierAddress;

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        payable
    {
        uint sendAmount = mintFee.mul(amount);
        require(msg.value >= sendAmount , "Not enough MATIC sent; check price!"); 
        payable(cashierAddress).transfer(sendAmount);
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        // payable(_address[i]).transfer(_amount[i]);
        _mintBatch(to, ids, amounts, data);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function setMintFee(uint _fee) onlyOwner public {
        mintFee = _fee;
    }

    function setCashierAddress(address _addr) onlyOwner public {
        require(_addr != address(0));
        cashierAddress = _addr;
    }

}